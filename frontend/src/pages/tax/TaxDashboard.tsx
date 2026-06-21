import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi } from '../../services/api';
import type { Auction } from '../../types';
import { formatCurrency } from '../../utils';
import { Receipt, Clock, CheckCircle, Calculator } from 'lucide-react';

export default function TaxDashboard() {
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

  const pendingCount = auctions.filter((a) => !a.taxCalculation && a.status === 'paid').length;
  const completedCount = auctions.filter((a) => a.taxCalculation).length;
  const totalTax = auctions.reduce(
    (sum, a) => sum + (a.taxCalculation?.totalTax || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">待测算</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已测算</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">税费总额</span>
            <Receipt size={20} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalTax)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">税费测算管理</h2>
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
                      {auction.taxCalculation ? (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                          已测算
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                          待测算
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{auction.caseNumber}</span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">{auction.title}</h3>
                  <div className="text-sm text-gray-500 mb-3">📍 {auction.propertyInfo.address}</div>

                  {auction.taxCalculation ? (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">税费合计</span>
                        <span className="text-purple-600 font-bold">
                          {formatCurrency(auction.taxCalculation.totalTax)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">成交价格</span>
                        <span className="text-blue-600 font-medium">
                          {formatCurrency(auction.transactionPrice || auction.auctionNotice?.startPrice || 0)}
                        </span>
                      </div>
                      <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <Calculator size={16} />
                        计算税费
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无待处理标的</div>
          )}
        </div>
      </div>
    </div>
  );
}
