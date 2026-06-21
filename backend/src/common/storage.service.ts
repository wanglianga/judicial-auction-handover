import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Auction,
  AuctionStatus,
  DepositRecord,
  BidRecord,
  LoanApplication,
  BalancePayment,
  PropertyArrears,
  TaxCalculation,
  KeyHandover,
  EvictionRecord,
  AcceptanceRecord,
  TimelineEvent,
} from '../common/types';

@Injectable()
export class StorageService implements OnModuleInit {
  private auctions: Map<string, Auction> = new Map();
  private timelineEvents: TimelineEvent[] = [];

  onModuleInit() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const now = new Date().toISOString();
    
    const auction1: Auction = {
      id: uuidv4(),
      caseNumber: '(2024)京民初字第001号',
      court: '北京市第一中级人民法院',
      judge: '张明法官',
      title: '北京市朝阳区建国路88号SOHO现代城A座2301室',
      propertyInfo: {
        address: '北京市朝阳区建国路88号SOHO现代城A座2301室',
        area: 128.5,
        floor: '23/32层',
        houseType: '住宅',
        ownershipCertificate: '京房权证朝字第123456号',
        landUseYears: '70年',
      },
      seizureInfo: [
        { order: 1, court: '北京市第一中级人民法院', caseNumber: '(2024)京民初字第001号', seizureDate: '2024-01-15' },
      ],
      mortgageInfo: [
        { mortgagee: '中国工商银行北京分行', amount: 3500000, registrationDate: '2020-05-20' },
      ],
      leaseInfo: [
        { lessee: '李某', leaseTerm: '2022-01-01至2027-01-01', rent: 8000, hasRegistration: false },
      ],
      householdInfo: {
        hasOccupancy: true,
        occupants: ['李某（承租人）'],
        canMove: false,
      },
      decorationInfo: {
        hasDecoration: true,
        description: '精装修，家电齐全',
        fixtures: ['中央空调', '整体橱柜', '实木地板'],
      },
      viewingRestriction: {
        hasRestriction: true,
        reason: '承租人不配合',
        restrictionType: '无法入户看样',
      },
      riskDisclosure: {
        seizureRisks: ['首封法院处置，需协调轮候查封法院'],
        mortgageRisks: ['存在银行抵押，成交后需解押'],
        leaseRisks: ['存在租约，买卖不破租赁', '承租人可能主张优先购买权'],
        householdRisks: ['房屋有人占用，可能需要强制腾退', '户籍尚未迁出'],
        otherRisks: ['物业费、水电费存在欠费'],
      },
      evaluationReport: {
        id: uuidv4(),
        agencyName: '北京华天评估有限公司',
        evaluationValue: 6500000,
        reportDate: '2024-03-10',
      },
      auctionNotice: {
        id: uuidv4(),
        publishDate: '2024-04-01',
        startPrice: 5200000,
        depositAmount: 520000,
        auctionStartTime: '2024-04-20T10:00:00',
        auctionEndTime: '2024-04-21T10:00:00',
        noticeContent: '本院依法对被执行人位于北京市朝阳区建国路88号的房产进行公开拍卖...',
      },
      currentPrice: 5200000,
      transactionPrice: 5850000,
      winningBidder: {
        id: 'bidder-001',
        name: '王建国',
        contact: '138****8888',
      },
      status: AuctionStatus.PAID,
      deposits: [
        {
          id: uuidv4(),
          auctionId: '',
          bidderId: 'bidder-001',
          bidderName: '王建国',
          amount: 520000,
          paidAt: '2024-04-18T14:30:00',
          status: 'paid',
        },
      ],
      bids: [
        {
          id: uuidv4(),
          auctionId: '',
          bidderId: 'bidder-001',
          bidderName: '王建国',
          amount: 5850000,
          bidAt: '2024-04-21T09:45:00',
          isWinning: true,
        },
      ],
      loanApplications: [
        {
          id: uuidv4(),
          auctionId: '',
          bidderId: 'bidder-001',
          bidderName: '王建国',
          loanAmount: 3500000,
          bankName: '中国建设银行',
          status: 'approved',
          appliedAt: '2024-04-22T10:00:00',
          approvedAt: '2024-04-25T15:00:00',
        },
      ],
      balancePayments: [
        {
          id: uuidv4(),
          auctionId: '',
          bidderId: 'bidder-001',
          amount: 5330000,
          paidAt: '2024-05-10T10:00:00',
          paymentMethod: '银行转账（含贷款）',
        },
      ],
      evictionRecords: [],
      createdAt: '2024-03-01T10:00:00',
      updatedAt: now,
    };
    auction1.deposits.forEach(d => d.auctionId = auction1.id);
    auction1.bids.forEach(b => b.auctionId = auction1.id);
    auction1.loanApplications.forEach(l => l.auctionId = auction1.id);
    auction1.balancePayments.forEach(p => p.auctionId = auction1.id);

    this.auctions.set(auction1.id, auction1);

    const auction2: Auction = {
      id: uuidv4(),
      caseNumber: '(2024)沪民初字第056号',
      court: '上海市浦东新区人民法院',
      judge: '李华法官',
      title: '上海市浦东新区陆家嘴环路1000号恒生银行大厦1502室',
      propertyInfo: {
        address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦1502室',
        area: 89.2,
        floor: '15/45层',
        houseType: '商住两用',
        ownershipCertificate: '沪房地浦字第2019056789号',
        landUseYears: '50年',
      },
      seizureInfo: [
        { order: 1, court: '上海市浦东新区人民法院', caseNumber: '(2024)沪民初字第056号', seizureDate: '2024-02-20' },
        { order: 2, court: '上海市黄浦区人民法院', caseNumber: '(2024)沪民初字第123号', seizureDate: '2024-02-25' },
      ],
      mortgageInfo: [
        { mortgagee: '招商银行上海分行', amount: 2800000, registrationDate: '2021-03-15' },
      ],
      leaseInfo: [],
      householdInfo: {
        hasOccupancy: false,
        canMove: true,
      },
      decorationInfo: {
        hasDecoration: true,
        description: '简装，办公装修',
        fixtures: ['玻璃隔断', '网络布线'],
      },
      viewingRestriction: {
        hasRestriction: false,
      },
      riskDisclosure: {
        seizureRisks: ['存在轮候查封，成交后需协调解封'],
        mortgageRisks: ['存在银行抵押'],
        leaseRisks: [],
        householdRisks: ['房屋空置，无占用'],
        otherRisks: ['商住房，税费较高', '物业费较高'],
      },
      evaluationReport: {
        id: uuidv4(),
        agencyName: '上海立信评估有限公司',
        evaluationValue: 4200000,
        reportDate: '2024-04-05',
      },
      auctionNotice: {
        id: uuidv4(),
        publishDate: '2024-05-10',
        startPrice: 3360000,
        depositAmount: 336000,
        auctionStartTime: '2024-06-01T10:00:00',
        auctionEndTime: '2024-06-02T10:00:00',
        noticeContent: '本院依法对被执行人位于上海市浦东新区的房产进行公开拍卖...',
      },
      currentPrice: 3360000,
      status: AuctionStatus.BIDDING,
      deposits: [],
      bids: [],
      loanApplications: [],
      balancePayments: [],
      evictionRecords: [],
      createdAt: '2024-04-01T10:00:00',
      updatedAt: now,
    };

    this.auctions.set(auction2.id, auction2);

    const auction3: Auction = {
      id: uuidv4(),
      caseNumber: '(2024)深民初字第128号',
      court: '深圳市南山区人民法院',
      judge: '陈伟法官',
      title: '深圳市南山区科技园南区高新南一道飞亚达科技大厦801室',
      propertyInfo: {
        address: '深圳市南山区科技园南区高新南一道飞亚达科技大厦801室',
        area: 156.8,
        floor: '8/20层',
        houseType: '写字楼',
        ownershipCertificate: '深房地字第4001234567号',
        landUseYears: '40年',
      },
      seizureInfo: [
        { order: 1, court: '深圳市南山区人民法院', caseNumber: '(2024)深民初字第128号', seizureDate: '2023-12-10' },
      ],
      mortgageInfo: [
        { mortgagee: '平安银行深圳分行', amount: 5000000, registrationDate: '2019-08-01' },
      ],
      leaseInfo: [
        { lessee: '深圳市某科技有限公司', leaseTerm: '2023-01-01至2028-01-01', rent: 25000, hasRegistration: true },
      ],
      householdInfo: {
        hasOccupancy: true,
        occupants: ['某科技公司（办公使用）'],
        canMove: true,
      },
      decorationInfo: {
        hasDecoration: true,
        description: '精装修办公空间',
        fixtures: ['办公家具', '会议室设备'],
      },
      viewingRestriction: {
        hasRestriction: false,
      },
      riskDisclosure: {
        seizureRisks: [],
        mortgageRisks: ['存在银行抵押贷款'],
        leaseRisks: ['存在合法租约，租期至2028年', '租金已支付至2024年底'],
        householdRisks: [],
        otherRisks: ['写字楼性质，税费政策不同', '需自行核实物业费、水电费'],
      },
      evaluationReport: {
        id: uuidv4(),
        agencyName: '深圳国众联评估有限公司',
        evaluationValue: 8500000,
        reportDate: '2024-03-20',
      },
      auctionNotice: {
        id: uuidv4(),
        publishDate: '2024-05-01',
        startPrice: 6800000,
        depositAmount: 680000,
        auctionStartTime: '2024-05-25T10:00:00',
        auctionEndTime: '2024-05-26T10:00:00',
        noticeContent: '本院依法对被执行人位于深圳市南山区的写字楼进行公开拍卖...',
      },
      currentPrice: 6800000,
      transactionPrice: 7650000,
      winningBidder: {
        id: 'bidder-002',
        name: '深圳市投资控股有限公司',
        contact: '0755-888****66',
      },
      status: AuctionStatus.EVICTION_IN_PROGRESS,
      deposits: [],
      bids: [],
      loanApplications: [],
      balancePayments: [],
      evictionRecords: [
        {
          id: uuidv4(),
          auctionId: '',
          evictionType: 'forced',
          plannedDate: '2024-06-15',
          status: 'planned',
          participants: ['法院执行局', '物业公司', '公证处'],
          obstacles: ['承租人拒绝搬离'],
          createdAt: '2024-06-01T10:00:00',
        },
      ],
      createdAt: '2024-02-15T10:00:00',
      updatedAt: now,
    };
    auction3.evictionRecords.forEach(e => e.auctionId = auction3.id);

    this.auctions.set(auction3.id, auction3);
  }

  getAllAuctions(): Auction[] {
    return Array.from(this.auctions.values());
  }

  getAuctionById(id: string): Auction | undefined {
    return this.auctions.get(id);
  }

  createAuction(auction: Omit<Auction, 'id' | 'createdAt' | 'updatedAt' | 'deposits' | 'bids' | 'loanApplications' | 'balancePayments' | 'evictionRecords'>): Auction {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newAuction: Auction = {
      ...auction,
      id,
      createdAt: now,
      updatedAt: now,
      deposits: [],
      bids: [],
      loanApplications: [],
      balancePayments: [],
      evictionRecords: [],
    };
    this.auctions.set(id, newAuction);
    this.addTimelineEvent(id, 'auction_created', '拍卖标的创建', '法院发布新的拍卖标的', now, auction.judge);
    return newAuction;
  }

  updateAuction(id: string, updates: Partial<Auction>): Auction | undefined {
    const auction = this.auctions.get(id);
    if (!auction) return undefined;
    
    const updated = { ...auction, ...updates, updatedAt: new Date().toISOString() };
    this.auctions.set(id, updated);
    return updated;
  }

  addDeposit(auctionId: string, deposit: Omit<DepositRecord, 'id' | 'auctionId'>): DepositRecord | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newDeposit: DepositRecord = {
      ...deposit,
      id: uuidv4(),
      auctionId,
    };
    auction.deposits.push(newDeposit);
    auction.updatedAt = new Date().toISOString();
    
    this.addTimelineEvent(auctionId, 'deposit_paid', '保证金缴纳', `${deposit.bidderName}缴纳保证金 ¥${deposit.amount.toLocaleString()}`, deposit.paidAt);
    
    return newDeposit;
  }

  addBid(auctionId: string, bid: Omit<BidRecord, 'id' | 'auctionId'>): BidRecord | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newBid: BidRecord = {
      ...bid,
      id: uuidv4(),
      auctionId,
    };
    auction.bids.push(newBid);
    auction.currentPrice = bid.amount;
    auction.updatedAt = new Date().toISOString();

    if (bid.isWinning) {
      auction.transactionPrice = bid.amount;
      auction.winningBidder = {
        id: bid.bidderId,
        name: bid.bidderName,
        contact: '',
      };
      auction.status = AuctionStatus.ENDED;
      this.addTimelineEvent(auctionId, 'auction_ended', '拍卖成交', `${bid.bidderName}以 ¥${bid.amount.toLocaleString()} 竞得`, bid.bidAt);
    }

    return newBid;
  }

  addLoanApplication(auctionId: string, loan: Omit<LoanApplication, 'id' | 'auctionId'>): LoanApplication | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newLoan: LoanApplication = {
      ...loan,
      id: uuidv4(),
      auctionId,
    };
    auction.loanApplications.push(newLoan);
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'loan_applied', '贷款申请', `${loan.bidderName}向${loan.bankName}申请贷款 ¥${loan.loanAmount.toLocaleString()}`, loan.appliedAt);

    return newLoan;
  }

  updateLoanApplication(auctionId: string, loanId: string, updates: Partial<LoanApplication>): LoanApplication | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const loan = auction.loanApplications.find(l => l.id === loanId);
    if (!loan) return undefined;

    Object.assign(loan, updates);
    auction.updatedAt = new Date().toISOString();

    if (updates.status === 'approved') {
      this.addTimelineEvent(auctionId, 'loan_approved', '贷款审批通过', `${loan.bankName}审批通过贷款 ¥${loan.loanAmount.toLocaleString()}`, updates.approvedAt || new Date().toISOString());
    } else if (updates.status === 'disbursed') {
      this.addTimelineEvent(auctionId, 'loan_disbursed', '贷款放款', `${loan.bankName}已放款 ¥${loan.loanAmount.toLocaleString()}`, updates.disbursedAt || new Date().toISOString());
    }

    return loan;
  }

  addBalancePayment(auctionId: string, payment: Omit<BalancePayment, 'id' | 'auctionId'>): BalancePayment | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newPayment: BalancePayment = {
      ...payment,
      id: uuidv4(),
      auctionId,
    };
    auction.balancePayments.push(newPayment);
    auction.status = AuctionStatus.PAID;
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'balance_paid', '尾款到账', `尾款 ¥${payment.amount.toLocaleString()} 已到账`, payment.paidAt);

    return newPayment;
  }

  updatePropertyArrears(auctionId: string, arrears: Omit<PropertyArrears, 'id' | 'auctionId'>): PropertyArrears | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newArrears: PropertyArrears = {
      ...arrears,
      id: uuidv4(),
      auctionId,
    };
    auction.propertyArrears = newArrears;
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'property_arrears_updated', '物业信息更新', '物业公司录入欠费及物业信息', arrears.recordedAt);

    return newArrears;
  }

  createTaxCalculation(auctionId: string, tax: Omit<TaxCalculation, 'id' | 'auctionId'>): TaxCalculation | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newTax: TaxCalculation = {
      ...tax,
      id: uuidv4(),
      auctionId,
    };
    auction.taxCalculation = newTax;
    auction.status = AuctionStatus.TAX_CALCULATED;
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'tax_calculated', '税费测算完成', `税费共计 ¥${tax.totalTax.toLocaleString()}`, tax.calculatedAt);

    return newTax;
  }

  createKeyHandover(auctionId: string, handover: Omit<KeyHandover, 'id' | 'auctionId'>): KeyHandover | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newHandover: KeyHandover = {
      ...handover,
      id: uuidv4(),
      auctionId,
    };
    auction.keyHandover = newHandover;
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'key_handover', '钥匙交接', `钥匙已交接给 ${handover.receiver}`, handover.handoverTime);

    return newHandover;
  }

  addEvictionRecord(auctionId: string, eviction: Omit<EvictionRecord, 'id' | 'auctionId' | 'createdAt'>): EvictionRecord | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newEviction: EvictionRecord = {
      ...eviction,
      id: uuidv4(),
      auctionId,
      createdAt: new Date().toISOString(),
    };
    auction.evictionRecords.push(newEviction);
    
    if (eviction.status === 'in_progress' || eviction.status === 'planned') {
      auction.status = AuctionStatus.EVICTION_IN_PROGRESS;
    } else if (eviction.status === 'completed') {
      auction.status = AuctionStatus.EVICTED;
    }
    
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'eviction_created', '腾退记录', eviction.evictionType === 'forced' ? '强制腾退计划已创建' : '自愿腾退记录已创建', new Date().toISOString());

    return newEviction;
  }

  updateEvictionRecord(auctionId: string, evictionId: string, updates: Partial<EvictionRecord>): EvictionRecord | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const eviction = auction.evictionRecords.find(e => e.id === evictionId);
    if (!eviction) return undefined;

    Object.assign(eviction, updates);
    auction.updatedAt = new Date().toISOString();

    if (updates.status === 'completed') {
      auction.status = AuctionStatus.EVICTED;
      this.addTimelineEvent(auctionId, 'eviction_completed', '腾退完成', '房屋已成功腾退', updates.actualDate || new Date().toISOString());
    }

    return eviction;
  }

  createAcceptanceRecord(auctionId: string, acceptance: Omit<AcceptanceRecord, 'id' | 'auctionId'>): AcceptanceRecord | undefined {
    const auction = this.auctions.get(auctionId);
    if (!auction) return undefined;

    const newAcceptance: AcceptanceRecord = {
      ...acceptance,
      id: uuidv4(),
      auctionId,
    };
    auction.acceptanceRecord = newAcceptance;
    auction.status = AuctionStatus.COMPLETED;
    auction.updatedAt = new Date().toISOString();

    this.addTimelineEvent(auctionId, 'acceptance_completed', '交房验收完成', '竞买人验收房屋并确认交接', acceptance.acceptanceTime);

    return newAcceptance;
  }

  confirmDeal(auctionId: string): boolean {
    const auction = this.auctions.get(auctionId);
    if (!auction) return false;

    auction.status = AuctionStatus.DEAL_CONFIRMED;
    auction.updatedAt = new Date().toISOString();
    this.addTimelineEvent(auctionId, 'deal_confirmed', '成交确认', '法院出具成交确认书', new Date().toISOString());
    return true;
  }

  updateAuctionStatus(auctionId: string, status: AuctionStatus): boolean {
    const auction = this.auctions.get(auctionId);
    if (!auction) return false;

    auction.status = status;
    auction.updatedAt = new Date().toISOString();
    return true;
  }

  private addTimelineEvent(auctionId: string, type: string, title: string, description: string, time: string, operator?: string) {
    this.timelineEvents.push({
      id: uuidv4(),
      auctionId,
      type,
      title,
      description,
      time,
      operator,
    });
  }

  getTimeline(auctionId: string): TimelineEvent[] {
    return this.timelineEvents
      .filter(e => e.auctionId === auctionId)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }
}
