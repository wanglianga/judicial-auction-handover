import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankApi } from '../../services/api';
import type { LoanApplication } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { CreditCard, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function BankDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<(LoanApplication & { auctionTitle?: string; caseNumber?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await bankApi.getLoanApplications();
      setLoans(data as any);
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = loans.filter((l) => l.status === 'pending').length;
  const approvedCount = loans.filter((l) => l.status === 'approved').length;
  const disbursedCount = loans.filter((l) => l.status === 'disbursed').length;
  const totalAmount = loans.reduce((sum, l) => sum + l.loanAmount, 0);

  const getStatusLabel = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: '审批中', color: 'bg-yellow-100 text-yellow-600' },
      approved: { label: '已审批', color: 'bg-green-100 text-green-600' },
      rejected: { label: '已拒绝', color: 'bg-red-100 text-red-600' },
      disbursed: { label: '已放款', color: 'bg-blue-100 text-blue-600' },
    };
    return map[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">待审批</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已审批</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{approvedCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已放款</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="text-blue-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{disbursedCount}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">贷款总额</span>
            <CreditCard size={20} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">贷款申请列表</h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : loans.length > 0 ? (
            <div className="space-y-3">
              {loans.map((loan) => {
                const statusInfo = getStatusLabel(loan.status);
                return (
                  <div
                    key={loan.id}
                    onClick={() => navigate(`/auction/${loan.auctionId}`)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-sm text-gray-500">{loan.bankName}</span>
                      </div>
                      <span className="text-xs text-gray-400">{loan.caseNumber}</span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-1">{loan.auctionTitle || '拍卖标的'}</h3>
                    <div className="text-sm text-gray-500 mb-3">申请人：{loan.bidderName}</div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-400">贷款金额</div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(loan.loanAmount)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">申请时间</div>
                        <div className="text-sm text-gray-500">{formatDate(loan.appliedAt)}</div>
                      </div>
                    </div>

                    {loan.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          审批通过
                        </button>
                        <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                          拒绝
                        </button>
                      </div>
                    )}
                    {loan.status === 'approved' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          确认放款
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无贷款申请</div>
          )}
        </div>
      </div>
    </div>
  );
}
