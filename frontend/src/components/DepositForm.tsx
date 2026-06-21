import { useState } from 'react';
import { bidderApi } from '../services/api';
import { formatCurrency } from '../utils';
import { useUserStore } from '../store/userStore';
import { PiggyBank, Loader2 } from 'lucide-react';

interface DepositFormProps {
  auctionId: string;
  auctionTitle: string;
  depositAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DepositForm({
  auctionId,
  auctionTitle,
  depositAmount,
  onSuccess,
  onCancel,
}: DepositFormProps) {
  const { userId, userName } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || loading) return;

    try {
      setLoading(true);
      await bidderApi.payDeposit(auctionId, {
        bidderId: userId,
        bidderName: userName,
        amount: depositAmount,
        paymentMethod,
      });
      onSuccess();
    } catch (error) {
      console.error('缴纳保证金失败', error);
      alert('缴纳保证金失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 text-yellow-700 mb-2">
          <PiggyBank size={20} />
          <span className="font-medium">保证金信息</span>
        </div>
        <div className="text-sm text-yellow-600">
          拍卖标的：{auctionTitle}
        </div>
        <div className="mt-2 text-2xl font-bold text-yellow-700">
          应缴保证金：{formatCurrency(depositAmount)}
        </div>
      </div>

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

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agreed"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 text-blue-600"
        />
        <label htmlFor="agreed" className="text-xs text-gray-500">
          我已阅读并同意《司法拍卖竞买须知》和《保证金缴纳协议》，了解保证金缴纳后非因法定事由不予退还。
        </label>
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
          disabled={!agreed || loading}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          确认缴纳 {formatCurrency(depositAmount)}
        </button>
      </div>
    </form>
  );
}
