import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionApi } from '../services/api';
import type { Auction, TimelineEvent } from '../types';
import { statusMap, formatCurrency, formatDate } from '../utils';
import { useUserStore } from '../store/userStore';
import Timeline from '../components/Timeline';
import Modal from '../components/Modal';
import DepositForm from '../components/DepositForm';
import LoanApplicationForm from '../components/LoanApplicationForm';
import BalancePaymentForm from '../components/BalancePaymentForm';
import PropertyInfoForm from '../components/PropertyInfoForm';
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  Landmark,
  Key,
  CheckCircle,
  Plus,
  Edit,
  PiggyBank,
} from 'lucide-react';

type TabType = 'info' | 'risk' | 'payment' | 'property' | 'tax' | 'eviction';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId, role } = useUserStore();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loading, setLoading] = useState(true);

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [auctionData, timelineData] = await Promise.all([
        auctionApi.getById(id!),
        auctionApi.getTimeline(id!),
      ]);
      setAuction(auctionData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('加载拍卖详情失败', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const statusInfo = statusMap[auction.status];

  const hasMyDeposit = auction.deposits.some((d) => d.bidderId === userId);
  const isWinner = auction.winningBidder?.id === userId;
  const hasMyLoan = auction.loanApplications.some((l) => l.bidderId === userId);
  const hasBalancePaid = auction.balancePayments.length > 0;

  const canPayDeposit = !hasMyDeposit && auction.status !== 'pending' && auction.auctionNotice;
  const canApplyLoan = isWinner && !hasMyLoan && auction.status !== 'pending';
  const canPayBalance = isWinner && !hasBalancePaid && auction.status !== 'pending';
  const canEditProperty = role === 'property';

  const handleDepositSuccess = () => {
    setDepositModalOpen(false);
    loadData();
  };

  const handleLoanSuccess = () => {
    setLoanModalOpen(false);
    loadData();
  };

  const handleBalanceSuccess = () => {
    setBalanceModalOpen(false);
    loadData();
  };

  const handlePropertySuccess = () => {
    setPropertyModalOpen(false);
    loadData();
  };

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'info', label: '标的信息', icon: FileText },
    { key: 'risk', label: '风险披露', icon: AlertTriangle },
    { key: 'payment', label: '款项信息', icon: CreditCard },
    { key: 'property', label: '物业信息', icon: Building2 },
    { key: 'tax', label: '税费信息', icon: Landmark },
    { key: 'eviction', label: '腾退交割', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">{auction.title}</h1>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              案号：{auction.caseNumber} · 执行法院：{auction.court} · 承办法官：{auction.judge}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-4">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 房产基本信息</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex">
                        <span className="text-gray-500 w-24">地址：</span>
                        <span className="text-gray-800 flex-1">{auction.propertyInfo.address}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">面积：</span>
                        <span className="text-gray-800">{auction.propertyInfo.area} ㎡</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">楼层：</span>
                        <span className="text-gray-800">{auction.propertyInfo.floor || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">房屋类型：</span>
                        <span className="text-gray-800">{auction.propertyInfo.houseType}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">产权证号：</span>
                        <span className="text-gray-800">{auction.propertyInfo.ownershipCertificate}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">土地使用年限：</span>
                        <span className="text-gray-800">{auction.propertyInfo.landUseYears || '-'}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 查封信息</h3>
                    <div className="space-y-3">
                      {auction.seizureInfo.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700">第 {item.order} 顺位查封</span>
                            <span className="text-gray-400">{item.seizureDate}</span>
                          </div>
                          <div className="text-gray-500">
                            {item.court} · {item.caseNumber}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 抵押信息</h3>
                    {auction.mortgageInfo.length > 0 ? (
                      <div className="space-y-3">
                        {auction.mortgageInfo.map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">{item.mortgagee}</span>
                              <span className="text-red-500 font-medium">{formatCurrency(item.amount)}</span>
                            </div>
                            <div className="text-gray-500">登记日期：{item.registrationDate}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">无抵押</div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 租赁信息</h3>
                    {auction.leaseInfo.length > 0 ? (
                      <div className="space-y-3">
                        {auction.leaseInfo.map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">承租人：{item.lessee}</span>
                              <span className="text-blue-500">{formatCurrency(item.rent)}/月</span>
                            </div>
                            <div className="text-gray-500">租期：{item.leaseTerm}</div>
                            <div className="text-gray-500">
                              是否备案：{item.hasRegistration ? '是' : '否'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">无租赁</div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 户籍占用</h3>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {auction.householdInfo.hasOccupancy ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">有占用</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">无占用</span>
                        )}
                        <span className="text-gray-500">
                          {auction.householdInfo.canMove ? '可迁离' : '暂不可迁离'}
                        </span>
                      </div>
                      {auction.householdInfo.occupants && auction.householdInfo.occupants.length > 0 && (
                        <div className="text-gray-500 mt-2">
                          占用人：{auction.householdInfo.occupants.join('、')}
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 装修附着物</h3>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="text-gray-700 mb-1">
                        {auction.decorationInfo.hasDecoration ? '有装修' : '无装修'}
                      </div>
                      {auction.decorationInfo.description && (
                        <div className="text-gray-500">{auction.decorationInfo.description}</div>
                      )}
                      {auction.decorationInfo.fixtures && auction.decorationInfo.fixtures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {auction.decorationInfo.fixtures.map((item, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👀 看样限制</h3>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      {auction.viewingRestriction.hasRestriction ? (
                        <>
                          <div className="text-yellow-600 font-medium mb-1">⚠️ 存在看样限制</div>
                          <div className="text-gray-500">限制类型：{auction.viewingRestriction.restrictionType}</div>
                          <div className="text-gray-500">原因：{auction.viewingRestriction.reason}</div>
                        </>
                      ) : (
                        <div className="text-green-600">✓ 无看样限制</div>
                      )}
                    </div>
                  </section>

                  {auction.evaluationReport && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 评估报告</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">评估机构：{auction.evaluationReport.agencyName}</span>
                          <span className="text-gray-400 text-sm">{auction.evaluationReport.reportDate}</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          评估价：{formatCurrency(auction.evaluationReport.evaluationValue)}
                        </div>
                      </div>
                    </section>
                  )}

                  {auction.auctionNotice && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">📢 拍卖公告</h3>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">发布日期：</span>
                            <span className="text-gray-800">{auction.auctionNotice.publishDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">起拍价：</span>
                            <span className="text-blue-600 font-medium">
                              {formatCurrency(auction.auctionNotice.startPrice)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">保证金：</span>
                            <span className="text-orange-500 font-medium">
                              {formatCurrency(auction.auctionNotice.depositAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">拍卖时间：</span>
                            <span className="text-gray-800">
                              {formatDate(auction.auctionNotice.auctionStartTime)} -{' '}
                              {formatDate(auction.auctionNotice.auctionEndTime)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                          {auction.auctionNotice.noticeContent}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
                      <AlertTriangle size={20} />
                      <span>风险提示</span>
                    </div>
                    <p className="text-sm text-yellow-600">
                      请竞买人务必仔细阅读以下风险披露信息，自行判断竞买风险。
                    </p>
                  </div>

                  <div className="space-y-3">
                    {auction.riskDisclosure.seizureRisks.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">📋 查封风险</h4>
                        <ul className="space-y-1">
                          {auction.riskDisclosure.seizureRisks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {auction.riskDisclosure.mortgageRisks.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">💰 抵押风险</h4>
                        <ul className="space-y-1">
                          {auction.riskDisclosure.mortgageRisks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {auction.riskDisclosure.leaseRisks.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">📄 租赁风险</h4>
                        <ul className="space-y-1">
                          {auction.riskDisclosure.leaseRisks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {auction.riskDisclosure.householdRisks.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">👥 户籍/占用风险</h4>
                        <ul className="space-y-1">
                          {auction.riskDisclosure.householdRisks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {auction.riskDisclosure.otherRisks.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">⚠️ 其他风险</h4>
                        <ul className="space-y-1">
                          {auction.riskDisclosure.otherRisks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  {role === 'bidder' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <h4 className="font-medium text-blue-700 mb-1">💰 我要操作</h4>
                          <p className="text-sm text-blue-600">
                            {hasMyDeposit
                              ? '您已缴纳保证金，可以参与竞拍'
                              : '缴纳保证金后即可参与竞拍'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {canPayDeposit && (
                            <button
                              onClick={() => setDepositModalOpen(true)}
                              className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                              <PiggyBank size={16} />
                              缴纳保证金
                            </button>
                          )}
                          {canApplyLoan && (
                            <button
                              onClick={() => setLoanModalOpen(true)}
                              className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Plus size={16} />
                              申请贷款
                            </button>
                          )}
                          {canPayBalance && (
                            <button
                              onClick={() => setBalanceModalOpen(true)}
                              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus size={16} />
                              支付尾款
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 保证金缴纳</h3>
                    {auction.deposits.length > 0 ? (
                      <div className="space-y-3">
                        {auction.deposits.map((deposit) => (
                          <div key={deposit.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700">{deposit.bidderName}</span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded ${
                                  deposit.status === 'paid'
                                    ? 'bg-green-100 text-green-600'
                                    : deposit.status === 'refunded'
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {deposit.status === 'paid'
                                  ? '已缴纳'
                                  : deposit.status === 'refunded'
                                  ? '已退还'
                                  : '已没收'}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(deposit.amount)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              缴纳时间：{formatDate(deposit.paidAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">暂无保证金缴纳记录</div>
                    )}
                  </section>

                  {auction.bids.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 竞拍记录</h3>
                      <div className="space-y-2">
                        {[...auction.bids]
                          .sort((a, b) => new Date(b.bidAt).getTime() - new Date(a.bidAt).getTime())
                          .map((bid) => (
                            <div
                              key={bid.id}
                              className={`p-3 rounded-lg flex justify-between items-center ${
                                bid.isWinning ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                              }`}
                            >
                              <div>
                                <span className="font-medium text-gray-700">{bid.bidderName}</span>
                                {bid.isWinning && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                                    中标
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600">{formatCurrency(bid.amount)}</div>
                                <div className="text-xs text-gray-400">{formatDate(bid.bidAt)}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>
                  )}

                  {auction.loanApplications.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">🏦 贷款申请</h3>
                      <div className="space-y-3">
                        {auction.loanApplications.map((loan) => (
                          <div key={loan.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className="font-medium text-gray-700">{loan.bidderName}</span>
                                <span className="text-gray-400 text-sm ml-2">→ {loan.bankName}</span>
                              </div>
                              <span
                                className={`px-2 py-0.5 text-xs rounded ${
                                  loan.status === 'approved'
                                    ? 'bg-green-100 text-green-600'
                                    : loan.status === 'rejected'
                                    ? 'bg-red-100 text-red-600'
                                    : loan.status === 'disbursed'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                {loan.status === 'pending'
                                  ? '审批中'
                                  : loan.status === 'approved'
                                  ? '已审批'
                                  : loan.status === 'rejected'
                                  ? '已拒绝'
                                  : '已放款'}
                              </span>
                            </div>
                            <div className="text-xl font-bold text-blue-600">
                              贷款金额：{formatCurrency(loan.loanAmount)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              申请时间：{formatDate(loan.appliedAt)}
                              {loan.approvedAt && ` · 审批时间：${formatDate(loan.approvedAt)}`}
                              {loan.disbursedAt && ` · 放款时间：${formatDate(loan.disbursedAt)}`}
                            </div>
                            {loan.rejectionReason && (
                              <div className="text-sm text-red-500 mt-1">拒绝原因：{loan.rejectionReason}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {auction.balancePayments.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">💵 尾款支付</h3>
                      <div className="space-y-3">
                        {auction.balancePayments.map((payment) => (
                          <div key={payment.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-green-700">尾款已到账</span>
                              <span className="text-green-600 font-medium">{payment.paymentMethod}</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-green-500 mt-1">
                              到账时间：{formatDate(payment.paidAt)}
                            </div>
                            {payment.remark && (
                              <div className="text-sm text-gray-500 mt-1">备注：{payment.remark}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {auction.winningBidder && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 竞得人信息</h3>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-lg font-medium text-gray-800">{auction.winningBidder.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          联系电话：{auction.winningBidder.contact}
                        </div>
                        {auction.transactionPrice && (
                          <div className="text-2xl font-bold text-red-500 mt-2">
                            成交价：{formatCurrency(auction.transactionPrice)}
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'property' && (
                <div className="space-y-6">
                  {canEditProperty && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-700 mb-1">🏢 物业信息管理</h4>
                        <p className="text-sm text-blue-600">
                          {auction.propertyArrears ? '点击修改可更新物业欠费信息' : '请录入物业欠费及相关信息'}
                        </p>
                      </div>
                      <button
                        onClick={() => setPropertyModalOpen(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {auction.propertyArrears ? (
                          <>
                            <Edit size={16} />
                            修改物业信息
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            录入物业信息
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800">🏢 物业信息</h3>
                  {auction.propertyArrears ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="text-sm text-red-600 mb-1">物业费欠费</div>
                          <div className="text-2xl font-bold text-red-500">
                            {formatCurrency(auction.propertyArrears.propertyFeeArrears)}
                          </div>
                        </div>
                        {auction.propertyArrears.waterArrears !== undefined && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600 mb-1">水费欠费</div>
                            <div className="text-2xl font-bold text-blue-500">
                              {formatCurrency(auction.propertyArrears.waterArrears)}
                            </div>
                          </div>
                        )}
                        {auction.propertyArrears.electricityArrears !== undefined && (
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <div className="text-sm text-yellow-600 mb-1">电费欠费</div>
                            <div className="text-2xl font-bold text-yellow-500">
                              {formatCurrency(auction.propertyArrears.electricityArrears)}
                            </div>
                          </div>
                        )}
                        {auction.propertyArrears.gasArrears !== undefined && (
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <div className="text-sm text-orange-600 mb-1">燃气费欠费</div>
                            <div className="text-2xl font-bold text-orange-500">
                              {formatCurrency(auction.propertyArrears.gasArrears)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">门禁系统</span>
                          <span className="text-gray-800">
                            {auction.propertyArrears.hasAccessControl ? '有' : '无'}
                          </span>
                        </div>
                        {auction.propertyArrears.parkingSpace && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">车位信息</span>
                            <span className="text-gray-800">{auction.propertyArrears.parkingSpace}</span>
                          </div>
                        )}
                        {auction.propertyArrears.decorationDeposit !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">装修押金</span>
                            <span className="text-gray-800">
                              {formatCurrency(auction.propertyArrears.decorationDeposit)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">录入时间</span>
                          <span className="text-gray-400">{formatDate(auction.propertyArrears.recordedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">物业公司尚未录入物业信息</div>
                  )}
                </div>
              )}

              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">🧾 税费信息</h3>
                  {auction.taxCalculation ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">税费合计</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(auction.taxCalculation.totalTax)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">契税</div>
                          <div className="text-xl font-bold text-gray-800">
                            {formatCurrency(auction.taxCalculation.deedTax)}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">增值税差额</div>
                          <div className="text-xl font-bold text-gray-800">
                            {formatCurrency(auction.taxCalculation.vatDifference)}
                          </div>
                        </div>
                        {auction.taxCalculation.individualIncomeTax !== undefined && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">个人所得税</div>
                            <div className="text-xl font-bold text-gray-800">
                              {formatCurrency(auction.taxCalculation.individualIncomeTax)}
                            </div>
                          </div>
                        )}
                        {auction.taxCalculation.stampDuty !== undefined && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">印花税</div>
                            <div className="text-xl font-bold text-gray-800">
                              {formatCurrency(auction.taxCalculation.stampDuty)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3">📋 过户材料清单</h4>
                        <ul className="space-y-2">
                          {auction.taxCalculation.transferMaterials.map((material, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle size={16} className="text-green-500" />
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-sm text-gray-400">
                        测算人：{auction.taxCalculation.calculator} · 测算时间：
                        {formatDate(auction.taxCalculation.calculatedAt)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">税务窗口尚未测算税费</div>
                  )}
                </div>
              )}

              {activeTab === 'eviction' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">🔨 腾退记录</h3>
                  {auction.evictionRecords.length > 0 ? (
                    <div className="space-y-4">
                      {auction.evictionRecords.map((record) => (
                        <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                  record.evictionType === 'forced'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                }`}
                              >
                                {record.evictionType === 'forced' ? '强制腾退' : '自愿腾退'}
                              </span>
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                  record.status === 'completed'
                                    ? 'bg-green-100 text-green-600'
                                    : record.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-600'
                                    : record.status === 'failed'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                {record.status === 'planned'
                                  ? '计划中'
                                  : record.status === 'in_progress'
                                  ? '进行中'
                                  : record.status === 'completed'
                                  ? '已完成'
                                  : '失败'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-400">计划：{record.plannedDate}</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">参与方：</span>
                              <span className="text-gray-700">{record.participants.join('、')}</span>
                            </div>
                            {record.obstacles && record.obstacles.length > 0 && (
                              <div>
                                <span className="text-gray-500">障碍：</span>
                                <span className="text-red-500">{record.obstacles.join('、')}</span>
                              </div>
                            )}
                            {record.result && (
                              <div>
                                <span className="text-gray-500">结果：</span>
                                <span className="text-gray-700">{record.result}</span>
                              </div>
                            )}
                            {record.actualDate && (
                              <div>
                                <span className="text-gray-500">实际日期：</span>
                                <span className="text-gray-700">{record.actualDate}</span>
                              </div>
                            )}
                            {record.remark && (
                              <div>
                                <span className="text-gray-500">备注：</span>
                                <span className="text-gray-700">{record.remark}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">暂无腾退记录</div>
                  )}

                  {auction.keyHandover && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔑 钥匙交接</h3>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-green-700">钥匙已交接</span>
                          <span className="text-green-500 text-sm">
                            {formatDate(auction.keyHandover.handoverTime)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">移交人：</span>
                            <span className="text-gray-700">{auction.keyHandover.handoverPerson}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">接收人：</span>
                            <span className="text-gray-700">{auction.keyHandover.receiver}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">钥匙数量：</span>
                            <span className="text-gray-700">{auction.keyHandover.keyCount} 把</span>
                          </div>
                          <div>
                            <span className="text-gray-500">门禁卡：</span>
                            <span className="text-gray-700">
                              {auction.keyHandover.hasAccessCard ? '有' : '无'}
                            </span>
                          </div>
                        </div>
                        {auction.keyHandover.remark && (
                          <div className="text-sm text-gray-500 mt-3 pt-3 border-t border-green-200">
                            备注：{auction.keyHandover.remark}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {auction.acceptanceRecord && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">🤝 交房验收</h3>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-blue-700">交房验收已完成</span>
                          <span className="text-blue-500 text-sm">
                            {formatDate(auction.acceptanceRecord.acceptanceTime)}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">买受人：</span>
                            <span className="text-gray-700">{auction.acceptanceRecord.bidderName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">房屋状况：</span>
                            <span className="text-gray-700">{auction.acceptanceRecord.houseCondition}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">是否有异议：</span>
                            <span className={auction.acceptanceRecord.hasObjections ? 'text-red-500' : 'text-green-500'}>
                              {auction.acceptanceRecord.hasObjections ? '是' : '否'}
                            </span>
                          </div>
                          {auction.acceptanceRecord.objections && (
                            <div>
                              <span className="text-gray-500">异议内容：</span>
                              <span className="text-red-500">{auction.acceptanceRecord.objections}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">签字人：</span>
                            <span className="text-gray-700">{auction.acceptanceRecord.signatory}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="w-80 border-l border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📅 流程时间线</h3>
          <Timeline events={timeline} />
        </aside>
      </div>

      <Modal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title="缴纳保证金"
        size="md"
      >
        <DepositForm
          auctionId={auction.id}
          auctionTitle={auction.title}
          depositAmount={auction.auctionNotice?.depositAmount || 0}
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
          auctionId={auction.id}
          auctionTitle={auction.title}
          transactionPrice={auction.transactionPrice || auction.currentPrice || 0}
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
          auctionId={auction.id}
          auctionTitle={auction.title}
          transactionPrice={auction.transactionPrice || auction.currentPrice || 0}
          depositAmount={auction.auctionNotice?.depositAmount || 0}
          onSuccess={handleBalanceSuccess}
          onCancel={() => setBalanceModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={propertyModalOpen}
        onClose={() => setPropertyModalOpen(false)}
        title={auction.propertyArrears ? '修改物业信息' : '录入物业信息'}
        size="lg"
      >
        <PropertyInfoForm
          auctionId={auction.id}
          auctionTitle={auction.title}
          initialData={auction.propertyArrears}
          onSuccess={handlePropertySuccess}
          onCancel={() => setPropertyModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
