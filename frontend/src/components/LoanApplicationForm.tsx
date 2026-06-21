import { useState } from 'react';
import { bidderApi } from '../services/api';
import { formatCurrency } from '../utils';
import { useUserStore } from '../store/userStore';
import { CreditCard, Loader2 } from 'lucide-react';

interface LoanApplicationFormProps {
  auctionId: string;
  auctionTitle: string;
  transactionPrice: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LoanApplicationForm({
  auctionId,
  auctionTitle,
  transactionPrice,
  onSuccess,
  onCancel,
}: LoanApplicationFormProps) {
  const { userId, userName } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState(Math.round(transactionPrice * 0.7));
  const [bankName, setBankName] = useState('中国建设银行');
  const [loanTerm, setLoanTerm] = useState('30年');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await bidderApi.applyLoan(auctionId, {
        bidderId: userId,
        bidderName: userName,
        loanAmount,
        bankName,
        loanTerm,
      });
      onSuccess();
    } catch (error) {
      console.error('提交贷款申请失败', error);
      alert('提交贷款申请失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const banks = [
    '中国工商银行',
    '中国建设银行',
    '中国农业银行',
    '中国银行',
    '招商银行',
    '交通银行',
  ];

  const terms = ['10年', '15年', '20年', '25年', '30年'];

  const maxLoan = Math.round(transactionPrice * 0.7);
  const minLoan = Math.round(transactionPrice * 0.3);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <CreditCard size={20} />
          <span className="font-medium">贷款申请</span>
        </div>
        <div className="text-sm text-blue-600">拍卖标的：{auctionTitle}</div>
        <div className="text-sm text-blue-600 mt-1">
          成交价格：{formatCurrency(transactionPrice)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          贷款银行
        </label>
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {banks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          贷款金额（最低 {formatCurrency(minLoan)}，最高 {formatCurrency(maxLoan)}）
        </label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          min={minLoan}
          max={maxLoan}
          step={10000}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="range"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          min={minLoan}
          max={maxLoan}
          step={10000}
          className="w-full mt-2"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatCurrency(minLoan)}</span>
          <span>{formatCurrency(maxLoan)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          贷款期限
        </label>
        <div className="flex flex-wrap gap-2">
          {terms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setLoanTerm(term)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                loanTerm === term
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
        <div className="flex justify-between mb-1">
          <span>贷款金额</span>
          <span className="font-medium text-gray-700">{formatCurrency(loanAmount)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>首付金额</span>
          <span className="font-medium text-gray-700">
            {formatCurrency(transactionPrice - loanAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>贷款成数</span>
          <span className="font-medium text-gray-700">
            {((loanAmount / transactionPrice) * 100).toFixed(1)}成
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading || loanAmount < minLoan || loanAmount > maxLoan}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          提交贷款申请
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        注：贷款最终审批结果以银行为准，提交后请等待银行审核
      </p>
    </form>
  );
}
