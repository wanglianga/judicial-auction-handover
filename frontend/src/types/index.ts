export const AuctionStatus = {
  PENDING: 'pending',
  PUBLISHED: 'published',
  BIDDING: 'bidding',
  ENDED: 'ended',
  DEAL_CONFIRMED: 'deal_confirmed',
  PAYMENT_IN_PROGRESS: 'payment_in_progress',
  PAID: 'paid',
  EVICTION_IN_PROGRESS: 'eviction_in_progress',
  EVICTED: 'evicted',
  TAX_CALCULATED: 'tax_calculated',
  TRANSFERRED: 'transferred',
  COMPLETED: 'completed',
} as const;

export type AuctionStatus = typeof AuctionStatus[keyof typeof AuctionStatus];

export const UserRole = {
  COURT: 'court',
  BIDDER: 'bidder',
  EVALUATION: 'evaluation',
  PROPERTY: 'property',
  BANK: 'bank',
  TAX: 'tax',
  EVICTION_STAFF: 'eviction_staff',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface PropertyInfo {
  address: string;
  area: number;
  floor?: string;
  houseType: string;
  ownershipCertificate: string;
  landUseYears?: string;
}

export interface SeizureInfo {
  order: number;
  court: string;
  caseNumber: string;
  seizureDate: string;
}

export interface MortgageInfo {
  mortgagee: string;
  amount: number;
  registrationDate: string;
}

export interface LeaseInfo {
  lessee: string;
  leaseTerm: string;
  rent: number;
  hasRegistration: boolean;
}

export interface HouseholdInfo {
  hasOccupancy: boolean;
  occupants?: string[];
  canMove: boolean;
}

export interface DecorationInfo {
  hasDecoration: boolean;
  description?: string;
  fixtures?: string[];
}

export interface ViewingRestriction {
  hasRestriction: boolean;
  reason?: string;
  restrictionType?: string;
}

export interface AuctionRisk {
  seizureRisks: string[];
  mortgageRisks: string[];
  leaseRisks: string[];
  householdRisks: string[];
  otherRisks: string[];
}

export interface EvaluationReport {
  id: string;
  agencyName: string;
  evaluationValue: number;
  reportDate: string;
  reportFile?: string;
}

export interface AuctionNotice {
  id: string;
  publishDate: string;
  startPrice: number;
  depositAmount: number;
  auctionStartTime: string;
  auctionEndTime: string;
  noticeContent: string;
}

export interface DepositRecord {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  paidAt: string;
  status: 'paid' | 'refunded' | 'forfeited';
  refundedAt?: string;
}

export interface BidRecord {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  bidAt: string;
  isWinning: boolean;
}

export interface LoanApplication {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  loanAmount: number;
  bankName: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  appliedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  rejectionReason?: string;
}

export interface BalancePayment {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  paidAt: string;
  paymentMethod: string;
  remark?: string;
}

export interface PropertyArrears {
  id: string;
  auctionId: string;
  propertyFeeArrears: number;
  waterArrears?: number;
  electricityArrears?: number;
  gasArrears?: number;
  heatingArrears?: number;
  hasAccessControl: boolean;
  parkingSpace?: string;
  decorationDeposit?: number;
  recordedAt: string;
}

export interface TaxCalculation {
  id: string;
  auctionId: string;
  deedTax: number;
  vatDifference: number;
  individualIncomeTax?: number;
  stampDuty?: number;
  totalTax: number;
  transferMaterials: string[];
  calculatedAt: string;
  calculator: string;
}

export interface KeyHandover {
  id: string;
  auctionId: string;
  handoverTime: string;
  handoverPerson: string;
  receiver: string;
  keyCount: number;
  hasAccessCard: boolean;
  hasRemoteControl: boolean;
  remark?: string;
}

export interface EvictionRecord {
  id: string;
  auctionId: string;
  evictionType: 'voluntary' | 'forced';
  plannedDate: string;
  actualDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  participants: string[];
  obstacles?: string[];
  result?: string;
  remark?: string;
  createdAt: string;
}

export interface AcceptanceRecord {
  id: string;
  auctionId: string;
  acceptanceTime: string;
  bidderName: string;
  houseCondition: string;
  hasObjections: boolean;
  objections?: string;
  signatory: string;
  remark?: string;
}

export interface Auction {
  id: string;
  caseNumber: string;
  court: string;
  judge: string;
  title: string;
  propertyInfo: PropertyInfo;
  seizureInfo: SeizureInfo[];
  mortgageInfo: MortgageInfo[];
  leaseInfo: LeaseInfo[];
  householdInfo: HouseholdInfo;
  decorationInfo: DecorationInfo;
  viewingRestriction: ViewingRestriction;
  riskDisclosure: AuctionRisk;
  evaluationReport?: EvaluationReport;
  auctionNotice?: AuctionNotice;
  currentPrice?: number;
  transactionPrice?: number;
  winningBidder?: {
    id: string;
    name: string;
    contact: string;
  };
  status: AuctionStatus;
  deposits: DepositRecord[];
  bids: BidRecord[];
  loanApplications: LoanApplication[];
  balancePayments: BalancePayment[];
  propertyArrears?: PropertyArrears;
  taxCalculation?: TaxCalculation;
  keyHandover?: KeyHandover;
  evictionRecords: EvictionRecord[];
  acceptanceRecord?: AcceptanceRecord;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  auctionId: string;
  type: string;
  title: string;
  description: string;
  time: string;
  operator?: string;
}

export interface CourtStatistics {
  total: number;
  pending: number;
  published: number;
  bidding: number;
  ended: number;
  paid: number;
  evictionInProgress: number;
  evicted: number;
  completed: number;
  totalTransactionValue: number;
}
