import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi } from '../../services/api';
import type { Auction } from '../../types';
import { formatCurrency } from '../../utils';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export default function EvaluationDashboard() {
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

  const pendingCount = auctions.filter((a) => !a.evaluationReport).length;
  const completedCount = auctions.filter((a) => a.evaluationReport).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">待评估标的</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已完成评估</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">评估总价值</span>
            <FileText size={20} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(
              auctions.reduce((sum, a) => sum + (a.evaluationReport?.evaluationValue || 0), 0)
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">评估任务列表</h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : auctions.length > 0 ? (
            <div className="space-y-3">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  onClick={() => navigate(`/auction/${auction.id}`)}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {auction.evaluationReport ? (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                          已评估
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                          待评估
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{auction.caseNumber}</span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">{auction.title}</h3>
                  <div className="text-sm text-gray-500 mb-3">📍 {auction.propertyInfo.address}</div>

                  {auction.evaluationReport ? (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400">评估机构：</span>
                        <span className="text-sm text-gray-600">{auction.evaluationReport.agencyName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">评估价值</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(auction.evaluationReport.evaluationValue)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-gray-100">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        提交评估报告
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无评估任务</div>
          )}
        </div>
      </div>
    </div>
  );
}
