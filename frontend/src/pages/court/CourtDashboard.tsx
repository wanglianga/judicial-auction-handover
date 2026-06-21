import { useState, useEffect } from 'react';
import { auctionApi, courtApi } from '../../services/api';
import type { Auction, CourtStatistics, AuctionStatus } from '../../types';
import { formatCurrency } from '../../utils';
import AuctionCard from '../../components/AuctionCard';
import { Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CourtDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [statistics, setStatistics] = useState<CourtStatistics | null>(null);
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | ''>('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [auctionsData, statsData] = await Promise.all([
        auctionApi.getAll(statusFilter || undefined),
        courtApi.getStatistics(),
      ]);
      
      let filtered = auctionsData;
      if (searchText) {
        filtered = auctionsData.filter(
          (a) =>
            a.title.includes(searchText) ||
            a.caseNumber.includes(searchText) ||
            a.propertyInfo.address.includes(searchText)
        );
      }
      setAuctions(filtered);
      setStatistics(statsData);
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const statCards = statistics
    ? [
        {
          label: '拍卖标的总数',
          value: statistics.total,
          icon: <TrendingUp className="text-blue-500" size={24} />,
          bg: 'bg-blue-50',
        },
        {
          label: '竞拍中',
          value: statistics.bidding,
          icon: <Clock className="text-yellow-500" size={24} />,
          bg: 'bg-yellow-50',
        },
        {
          label: '已成交',
          value: statistics.paid + statistics.evictionInProgress + statistics.evicted + statistics.completed,
          icon: <CheckCircle className="text-green-500" size={24} />,
          bg: 'bg-green-50',
        },
        {
          label: '腾退中',
          value: statistics.evictionInProgress,
          icon: <AlertTriangle className="text-red-500" size={24} />,
          bg: 'bg-red-50',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{card.value}</div>
          </div>
        ))}
        {statistics && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
            <div className="text-sm opacity-80 mb-1">成交总金额</div>
            <div className="text-2xl font-bold">{formatCurrency(statistics.totalTransactionValue)}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">拍卖标的管理</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={18} />
              <span>发布新标的</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜索案号、标题、地址..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                搜索
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AuctionStatus | '')}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部状态</option>
                <option value="pending">待发布</option>
                <option value="published">已发布</option>
                <option value="bidding">竞拍中</option>
                <option value="ended">竞拍结束</option>
                <option value="deal_confirmed">成交确认</option>
                <option value="paid">已付款</option>
                <option value="eviction_in_progress">腾退中</option>
                <option value="evicted">已腾退</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无拍卖标的</div>
          )}
        </div>
      </div>
    </div>
  );
}
