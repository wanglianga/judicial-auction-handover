import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi } from '../../services/api';
import type { Auction } from '../../types';
import { Clock, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

export default function EvictionDashboard() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await auctionApi.getAll();
      setAuctions(data);
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const inProgressCount = auctions.filter(
    (a) => a.evictionRecords.some((r) => r.status === 'in_progress' || r.status === 'planned')
  ).length;
  const completedCount = auctions.filter(
    (a) => a.evictionRecords.some((r) => r.status === 'completed')
  ).length;
  const hasRiskCount = auctions.filter(
    (a) => a.householdInfo.hasOccupancy || a.leaseInfo.length > 0
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">待腾退</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{inProgressCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已完成</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">有腾退风险</span>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{hasRiskCount}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">强制腾退</span>
            <Shield size={20} />
          </div>
          <div className="text-2xl font-bold">
            {
              auctions.filter((a) =>
                a.evictionRecords.some((r) => r.evictionType === 'forced')
              ).length
            }
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">腾退任务列表</h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : auctions.length > 0 ? (
            <div className="space-y-3">
              {auctions.map((auction) => {
                const latestEviction = auction.evictionRecords[auction.evictionRecords.length - 1];
                const hasRisk = auction.householdInfo.hasOccupancy || auction.leaseInfo.length > 0;

                return (
                  <div
                    key={auction.id}
                    onClick={() => navigate(`/auction/${auction.id}`)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {latestEviction ? (
                          <>
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                latestEviction.evictionType === 'forced'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-green-100 text-green-600'
                              }`}
                            >
                              {latestEviction.evictionType === 'forced' ? '强制腾退' : '自愿腾退'}
                            </span>
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                latestEviction.status === 'completed'
                                  ? 'bg-green-100 text-green-600'
                                  : latestEviction.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-600'
                                  : latestEviction.status === 'failed'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              {latestEviction.status === 'planned'
                                ? '计划中'
                                : latestEviction.status === 'in_progress'
                                ? '进行中'
                                : latestEviction.status === 'completed'
                                ? '已完成'
                                : '失败'}
                            </span>
                          </>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            待安排
                          </span>
                        )}
                        {hasRisk && (
                          <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded">
                            有腾退风险
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{auction.caseNumber}</span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2">{auction.title}</h3>
                    <div className="text-sm text-gray-500 mb-3">📍 {auction.propertyInfo.address}</div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-xs text-gray-400">
                          {auction.householdInfo.hasOccupancy && (
                            <span>👥 有人占用</span>
                          )}
                          {auction.leaseInfo.length > 0 && (
                            <span>📄 有租约</span>
                          )}
                          {auction.viewingRestriction.hasRestriction && (
                            <span>🚫 看样受限</span>
                          )}
                        </div>
                        {!latestEviction || latestEviction.status === 'failed' ? (
                          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            安排腾退
                          </button>
                        ) : latestEviction.status === 'planned' ? (
                          <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            开始执行
                          </button>
                        ) : latestEviction.status === 'in_progress' ? (
                          <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            完成腾退
                          </button>
                        ) : (
                          <span className="text-green-600 text-sm font-medium">✓ 已完成</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无腾退任务</div>
          )}
        </div>
      </div>
    </div>
  );
}
