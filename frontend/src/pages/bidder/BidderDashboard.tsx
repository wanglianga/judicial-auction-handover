import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi, bidderApi } from '../../services/api';
import type { Auction, DepositRecord, BidRecord, LoanApplication } from '../../types';
import { formatCurrency, statusMap } from '../../utils';
import { useUserStore } from '../../store/userStore';
import Modal from '../../components/Modal';
import DepositForm from '../../components/DepositForm';
import LoanApplicationForm from '../../components/LoanApplicationForm';
import BalancePaymentForm from '../../components/BalancePaymentForm';
import { CreditCard, TrendingUp, AlertTriangle, PiggyBank, Plus, CheckCircle, Clock } from 'lucide-react';

export default function BidderDashboard() {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [bids, setBids] = useState<BidRecord[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const auctionsData = await auctionApi.getAll();

      if (userId) {
        const [depositsData, bidsData, loansData] = await Promise.all([
          bidderApi.getMyDeposits(userId),
          bidderApi.getMyBids(userId),
          bidderApi.getMyLoans(userId),
        ]);
        setDeposits(depositsData);
        setBids(bidsData);
        setLoans(loansData);

        if (activeTab === 'my') {
          const myAuctionIds = new Set([
            ...depositsData.map((d) => d.auctionId),
            ...bidsData.map((b) => b.auctionId),
            ...loansData.map((l) => l.auctionId),
          ]);
          setAuctions(auctionsData.filter((a) => myAuctionIds.has(a.id)));
        } else {
          setAuctions(auctionsData);
        }
      } else {
        setAuctions(auctionsData);
      }
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  }, [userId, activeTab]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handlePayDeposit = (auction: Auction) => {
    setSelectedAuction(auction);
    setDepositModalOpen(true);
  };

  const handleApplyLoan = (auction: Auction) => {
    setSelectedAuction(auction);
    setLoanModalOpen(true);
  };

  const handlePayBalance = (auction: Auction) => {
    setSelectedAuction(auction);
    setBalanceModalOpen(true);
  };

  const handleDepositSuccess = async () => {
    setDepositModalOpen(false);
    setSelectedAuction(null);
    await loadAllData();
  };

  const handleLoanSuccess = async () => {
    setLoanModalOpen(false);
    setSelectedAuction(null);
    await loadAllData();
  };

  const handleBalanceSuccess = async () => {
    setBalanceModalOpen(false);
    setSelectedAuction(null);
    await loadAllData();
  };

  const myWinningBids = bids.filter((b) => b.isWinning);

  const canPayDeposit = (auction: Auction) => {
    const hasMyDeposit = deposits.some((d) => d.auctionId === auction.id);
    return !hasMyDeposit && auction.status !== 'pending' && auction.auctionNotice;
  };

  const canApplyLoan = (auction: Auction) => {
    const isWinner = auction.winningBidder?.id === userId;
    const hasMyLoan = loans.some((l) => l.auctionId === auction.id);
    return isWinner && !hasMyLoan && auction.status !== 'pending';
  };

  const canPayBalance = (auction: Auction) => {
    const isWinner = auction.winningBidder?.id === userId;
    const hasBalancePaid = auction.balancePayments.length > 0;
    return isWinner && !hasBalancePaid && auction.status !== 'pending';
  };

  const handleCardClick = (auction: Auction, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    navigate(`/auction/${auction.id}`);
  };

  const getBidderSteps = (auction: Auction) => {
    const hasMyDeposit = deposits.some((d) => d.auctionId === auction.id);
    const isWinner = auction.winningBidder?.id === userId;
    const hasMyLoan = loans.some((l) => l.auctionId === auction.id);
    const hasBalancePaid = auction.balancePayments.length > 0;

    return [
      { label: '缴纳保证金', done: hasMyDeposit, actionable: canPayDeposit(auction) },
      { label: '参与竞拍', done: bids.some((b) => b.auctionId === auction.id), actionable: false },
      { label: '申请贷款', done: hasMyLoan, actionable: isWinner && !hasMyLoan && canApplyLoan(auction) },
      { label: '支付尾款', done: hasBalancePaid, actionable: isWinner && !hasBalancePaid && canPayBalance(auction) },
    ];
  };

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
            审批通过 {loans.filter((l) => l.status === 'approved' || l.status === 'disbursed').length} 笔
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
                const steps = getBidderSteps(auction);

                return (
                  <div
                    key={auction.id}
                    onClick={(e) => handleCardClick(auction, e)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
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

                    <div className="flex items-center gap-4 mb-3 p-2 bg-gray-50 rounded-lg">
                      {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          {step.done ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : step.actionable ? (
                            <Clock size={14} className="text-blue-500 animate-pulse" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={`text-xs ${step.done ? 'text-green-600 font-medium' : step.actionable ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
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

                      <div className="flex flex-wrap gap-1 justify-end max-w-xs">
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

                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      {canPayDeposit(auction) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayDeposit(auction);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          <PiggyBank size={14} />
                          缴纳保证金
                        </button>
                      )}

                      {canApplyLoan(auction) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyLoan(auction);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CreditCard size={14} />
                          申请贷款
                        </button>
                      )}

                      {canPayBalance(auction) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayBalance(auction);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={14} />
                          支付尾款
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/auction/${auction.id}`);
                        }}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                      >
                        查看详情 →
                      </button>
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

      {selectedAuction && (
        <>
          <Modal
            isOpen={depositModalOpen}
            onClose={() => setDepositModalOpen(false)}
            title="缴纳保证金"
            size="md"
          >
            <DepositForm
              auctionId={selectedAuction.id}
              auctionTitle={selectedAuction.title}
              depositAmount={selectedAuction.auctionNotice?.depositAmount || 0}
              onSuccess={handleDepositSuccess}
              onCancel={() => setDepositModalOpen(false)}
            />
          </Modal>

          <Modal
            isOpen={loanModalOpen}
            onClose={() => setLoanModalOpen(false)}
            title="提交贷款申请"
            size="lg"
          >
            <LoanApplicationForm
              auctionId={selectedAuction.id}
              auctionTitle={selectedAuction.title}
              transactionPrice={selectedAuction.transactionPrice || selectedAuction.currentPrice || 0}
              onSuccess={handleLoanSuccess}
              onCancel={() => setLoanModalOpen(false)}
            />
          </Modal>

          <Modal
            isOpen={balanceModalOpen}
            onClose={() => setBalanceModalOpen(false)}
            title="支付尾款"
            size="lg"
          >
            <BalancePaymentForm
              auctionId={selectedAuction.id}
              auctionTitle={selectedAuction.title}
              transactionPrice={selectedAuction.transactionPrice || selectedAuction.currentPrice || 0}
              depositAmount={selectedAuction.auctionNotice?.depositAmount || 0}
              onSuccess={handleBalanceSuccess}
              onCancel={() => setBalanceModalOpen(false)}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
