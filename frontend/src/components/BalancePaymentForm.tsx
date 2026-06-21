import { useState } from 'react';
import { bidderApi } from '../services/api';
import { formatCurrency } from '../utils';
import { useUserStore } from '../store/userStore';
import { Wallet, Loader2 } from 'lucide-react';

interface BalancePaymentFormProps {
  auctionId: string;
  auctionTitle: string;
  transactionPrice: number;
  depositAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BalancePaymentForm({
  auctionId,
  auctionTitle,
  transactionPrice,
  depositAmount,
  onSuccess,
  onCancel,
}: BalancePaymentFormProps) {
  const { userId } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [useLoan, setUseLoan] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);

  const balanceAmount = transactionPrice - depositAmount;
  const selfPayAmount = useLoan ? balanceAmount - loanAmount : balanceAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await bidderApi.payBalance(auctionId, {
        bidderId: userId,
        amount: balanceAmount,
        paymentMethod: useLoan ? `银行贷款+${paymentMethod}` : paymentMethod,
        remark: useLoan ? `含贷款${formatCurrency(loanAmount)}` : '',
      });
      onSuccess();
    } catch (error) {
      console.error('支付尾款失败', error);
      alert('支付尾款失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <Wallet size={20} />
          <span className="font-medium">尾款支付</span>
        </div>
        <div className="text-sm text-green-600">拍卖标的：{auctionTitle}</div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-2 bg-white/60 rounded">
            <div className="text-xs text-green-500">成交总价</div>
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(transactionPrice)}
            </div>
          </div>
          <div className="p-2 bg-white/60 rounded">
            <div className="text-xs text-green-500">已缴保证金</div>
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(depositAmount)}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">应补尾款</span>
            <span className="text-2xl font-bold text-green-700">
              {formatCurrency(balanceAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
          <span className="text-sm font-medium text-gray-700">使用银行贷款</span>
          <p className="text-xs text-gray-400 mt-0.5">如已申请贷款，可抵扣部分尾款</p>
        </div>
        <button
          type="button"
          onClick={() => setUseLoan(!useLoan)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            useLoan ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              useLoan ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {useLoan && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            贷款金额
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            placeholder="请输入贷款金额"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            自付金额：{formatCurrency(Math.max(0, balanceAmount - loanAmount))}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          支付方式
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">🏦 银行转账</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="alipay"
              checked={paymentMethod === 'alipay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">📱 支付宝</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="wechat"
              checked={paymentMethod === 'wechat'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">💬 微信支付</span>
          </label>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg text-sm">
        <div className="flex justify-between mb-1 text-blue-600">
          <span>本次需支付</span>
          <span className="text-xl font-bold text-blue-700">
            {formatCurrency(selfPayAmount)}
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
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          确认支付 {formatCurrency(selfPayAmount)}
        </button>
      </div>
    </form>
  );
}
