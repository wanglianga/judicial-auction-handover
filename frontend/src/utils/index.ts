import { AuctionStatus } from '../types';

export const statusMap: Record<AuctionStatus, { label: string; color: string }> = {
  [AuctionStatus.PENDING]: { label: '待发布', color: 'bg-gray-100 text-gray-800' },
  [AuctionStatus.PUBLISHED]: { label: '已发布', color: 'bg-blue-100 text-blue-800' },
  [AuctionStatus.BIDDING]: { label: '竞拍中', color: 'bg-yellow-100 text-yellow-800' },
  [AuctionStatus.ENDED]: { label: '竞拍结束', color: 'bg-orange-100 text-orange-800' },
  [AuctionStatus.DEAL_CONFIRMED]: { label: '成交确认', color: 'bg-green-100 text-green-800' },
  [AuctionStatus.PAYMENT_IN_PROGRESS]: { label: '付款中', color: 'bg-purple-100 text-purple-800' },
  [AuctionStatus.PAID]: { label: '已付款', color: 'bg-emerald-100 text-emerald-800' },
  [AuctionStatus.EVICTION_IN_PROGRESS]: { label: '腾退中', color: 'bg-red-100 text-red-800' },
  [AuctionStatus.EVICTED]: { label: '已腾退', color: 'bg-teal-100 text-teal-800' },
  [AuctionStatus.TAX_CALCULATED]: { label: '税费已算', color: 'bg-indigo-100 text-indigo-800' },
  [AuctionStatus.TRANSFERRED]: { label: '已过户', color: 'bg-cyan-100 text-cyan-800' },
  [AuctionStatus.COMPLETED]: { label: '已完成', color: 'bg-green-100 text-green-800' },
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const roleMap: Record<string, { label: string; icon: string; description: string }> = {
  court: { label: '法院执行局', icon: '⚖️', description: '发布拍卖标的、监督执行流程' },
  bidder: { label: '竞买人', icon: '👤', description: '参与竞拍、缴纳保证金、支付尾款' },
  evaluation: { label: '评估机构', icon: '📊', description: '出具房产评估报告' },
  property: { label: '物业公司', icon: '🏢', description: '提供物业欠费、门禁、车位信息' },
  bank: { label: '银行', icon: '🏦', description: '审批贷款、管理放款流程' },
  tax: { label: '税务窗口', icon: '🧾', description: '计算税费、提供过户材料' },
  eviction_staff: { label: '腾退协助人员', icon: '🔑', description: '执行腾退、钥匙交接、交房验收' },
};
