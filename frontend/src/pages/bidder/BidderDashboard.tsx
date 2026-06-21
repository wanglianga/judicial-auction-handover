import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi, bidderApi } from '../../services/api';
import type { Auction, DepositRecord, BidRecord, LoanApplication } from '../../types';
import { formatCurrency, statusMap } from '../../utils';
import { useUserStore } from '../../store/userStore';
import { CreditCard, TrendingUp, AlertTriangle, PiggyBank } from 'lucide-react';

export default function BidderDashboard() {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [bids, setBids] = useState<BidRecord[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    loadData();
  }, [userId, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const auctionsData = await auctionApi.getAll();
      
      if (activeTab === 'my' && userId) {
        const [depositsData, bidsData, loansData] = await Promise.all([
          bidderApi.getMyDeposits(userId),
          bidderApi.getMyBids(userId),
          bidderApi.getMyLoans(userId),
        ]);
        setDeposits(depositsData);
        setBids(bidsData);
        setLoans(loansData);

        const myAuctionIds = new Set([
          ...depositsData.map((d) => d.auctionId),
          ...bidsData.map((b) => b.auctionId),
          ...loansData.map((l) => l.auctionId),
        ]);
        setAuctions(auctionsData.filter((a) => myAuctionIds.has(a.id)));
      } else {
        setAuctions(auctionsData);
      }
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const myWinningBids = bids.filter((b) => b.isWinning);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已缴纳保证金</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <PiggyBank className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{deposits.length} 笔</div>
          <div className="text-sm text-gray-400 mt-1">
            合计 {formatCurrency(deposits.reduce((sum, d) => sum + d.amount, 0))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">竞拍记录</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{bids.length} 次</div>
          <div className="text-sm text-gray-400 mt-1">其中中标 {myWinningBids.length} 次</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">贷款申请</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{loans.length} 笔</div>
          <div className="text-sm text-gray-400 mt-1">
            审批通过 {loans.filter((l) => l.status === 'approved').length} 笔
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">待关注风险</span>
            <AlertTriangle size={20} />
          </div>
          <div className="text-2xl font-bold">
            {auctions.filter((a) => Object.values(a.riskDisclosure).some((r) => r.length > 0)).length}
          </div>
          <div className="text-sm opacity-80 mt-1">个标的存在风险提示</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">拍卖标的</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                全部标的
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  activeTab === 'my'
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                我的参与
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : auctions.length > 0 ? (
            <div className="space-y-3">
              {auctions.map((auction) => {
                const statusInfo = statusMap[auction.status];
                const hasMyDeposit = deposits.some((d) => d.auctionId === auction.id);

                const isWinner = auction.winningBidder?.id === userId;

                return (
                  <div
                    key={auction.id}
                    onClick={() => navigate(`/auction/${auction.id}`)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {hasMyDeposit && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                            已缴保证金
                          </span>
                        )}
                        {isWinner && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            🏆 已竞得
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{auction.caseNumber}</span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2">{auction.title}</h3>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      📍 {auction.propertyInfo.address}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-6">
                        <div>
                          <div className="text-xs text-gray-400">起拍价</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(auction.auctionNotice?.startPrice || 0)}
                          </div>
                        </div>
                        {auction.currentPrice && (
                          <div>
                            <div className="text-xs text-gray-400">当前价</div>
                            <div className="text-lg font-bold text-red-500">
                              {formatCurrency(auction.currentPrice)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 justify-end max-w-md">
                        {auction.riskDisclosure.leaseRisks.length > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded">
                            有租约
                          </span>
                        )}
                        {auction.householdInfo.hasOccupancy && (
                          <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded">
                            有占用
                          </span>
                        )}
                        {auction.viewingRestriction.hasRestriction && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded">
                            看样受限
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {activeTab === 'my' ? '您还没有参与任何拍卖' : '暂无拍卖标的'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
