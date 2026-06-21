import axios from 'axios';
import type {
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
  CourtStatistics,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

export const auctionApi = {
  getAll: (status?: AuctionStatus, court?: string) =>
    api.get<Auction[]>('/api/auctions', { params: { status, court } }).then(res => res.data),
  
  getById: (id: string) =>
    api.get<Auction>(`/api/auctions/${id}`).then(res => res.data),
  
  create: (data: any) =>
    api.post<Auction>('/api/auctions', data).then(res => res.data),
  
  updateStatus: (id: string, status: AuctionStatus) =>
    api.put(`/api/auctions/${id}/status`, { status }).then(res => res.data),
  
  publish: (id: string, data: any) =>
    api.post<Auction>(`/api/auctions/${id}/publish`, data).then(res => res.data),
  
  confirmDeal: (id: string) =>
    api.post(`/api/auctions/${id}/confirm-deal`).then(res => res.data),
  
  getTimeline: (id: string) =>
    api.get<TimelineEvent[]>(`/api/auctions/${id}/timeline`).then(res => res.data),
};

export const bidderApi = {
  payDeposit: (auctionId: string, data: any) =>
    api.post<DepositRecord>(`/api/bidder/auctions/${auctionId}/deposit`, data).then(res => res.data),
  
  placeBid: (auctionId: string, data: any) =>
    api.post<BidRecord>(`/api/bidder/auctions/${auctionId}/bid`, data).then(res => res.data),
  
  applyLoan: (auctionId: string, data: any) =>
    api.post<LoanApplication>(`/api/bidder/auctions/${auctionId}/loan`, data).then(res => res.data),
  
  payBalance: (auctionId: string, data: any) =>
    api.post<BalancePayment>(`/api/bidder/auctions/${auctionId}/balance`, data).then(res => res.data),
  
  getMyDeposits: (bidderId: string) =>
    api.get<DepositRecord[]>('/api/bidder/deposits', { params: { bidderId } }).then(res => res.data),
  
  getMyBids: (bidderId: string) =>
    api.get<BidRecord[]>('/api/bidder/bids', { params: { bidderId } }).then(res => res.data),
  
  getMyLoans: (bidderId: string) =>
    api.get<LoanApplication[]>('/api/bidder/loans', { params: { bidderId } }).then(res => res.data),
};

export const bankApi = {
  getLoanApplications: (bankName?: string) =>
    api.get<LoanApplication[]>('/api/bank/loans', { params: { bankName } }).then(res => res.data),
  
  approveLoan: (auctionId: string, loanId: string) =>
    api.put<LoanApplication>(`/api/bank/auctions/${auctionId}/loans/${loanId}/approve`).then(res => res.data),
  
  rejectLoan: (auctionId: string, loanId: string, reason: string) =>
    api.put<LoanApplication>(`/api/bank/auctions/${auctionId}/loans/${loanId}/reject`, { reason }).then(res => res.data),
  
  disburseLoan: (auctionId: string, loanId: string) =>
    api.put<LoanApplication>(`/api/bank/auctions/${auctionId}/loans/${loanId}/disburse`).then(res => res.data),
};

export const propertyApi = {
  getArrears: (auctionId: string) =>
    api.get<PropertyArrears>(`/api/property/auctions/${auctionId}/arrears`).then(res => res.data),
  
  updateArrears: (auctionId: string, data: any) =>
    api.put<PropertyArrears>(`/api/property/auctions/${auctionId}/arrears`, data).then(res => res.data),
};

export const taxApi = {
  getCalculation: (auctionId: string) =>
    api.get<TaxCalculation>(`/api/tax/auctions/${auctionId}/calculation`).then(res => res.data),
  
  calculate: (auctionId: string, data: any) =>
    api.post<TaxCalculation>(`/api/tax/auctions/${auctionId}/calculate`, data).then(res => res.data),
};

export const evictionApi = {
  getRecords: (auctionId: string) =>
    api.get<EvictionRecord[]>(`/api/eviction/auctions/${auctionId}/records`).then(res => res.data),
  
  createPlan: (auctionId: string, data: any) =>
    api.post<EvictionRecord>(`/api/eviction/auctions/${auctionId}/plan`, data).then(res => res.data),
  
  startEviction: (auctionId: string, recordId: string) =>
    api.put<EvictionRecord>(`/api/eviction/auctions/${auctionId}/records/${recordId}/start`).then(res => res.data),
  
  completeEviction: (auctionId: string, recordId: string, result: string, actualDate?: string) =>
    api.put<EvictionRecord>(`/api/eviction/auctions/${auctionId}/records/${recordId}/complete`, { result, actualDate }).then(res => res.data),
  
  failEviction: (auctionId: string, recordId: string, reason: string) =>
    api.put<EvictionRecord>(`/api/eviction/auctions/${auctionId}/records/${recordId}/fail`, { reason }).then(res => res.data),
  
  getKeyHandover: (auctionId: string) =>
    api.get<KeyHandover>(`/api/eviction/auctions/${auctionId}/key-handover`).then(res => res.data),
  
  handoverKeys: (auctionId: string, data: any) =>
    api.post<KeyHandover>(`/api/eviction/auctions/${auctionId}/key-handover`, data).then(res => res.data),
  
  getAcceptance: (auctionId: string) =>
    api.get<AcceptanceRecord>(`/api/eviction/auctions/${auctionId}/acceptance`).then(res => res.data),
  
  createAcceptance: (auctionId: string, data: any) =>
    api.post<AcceptanceRecord>(`/api/eviction/auctions/${auctionId}/acceptance`, data).then(res => res.data),
};

export const evaluationApi = {
  getReport: (auctionId: string) =>
    api.get(`/api/evaluation/auctions/${auctionId}/report`).then(res => res.data),
  
  submitReport: (auctionId: string, data: any) =>
    api.post(`/api/evaluation/auctions/${auctionId}/report`, data).then(res => res.data),
};

export const courtApi = {
  getAuctions: (court: string) =>
    api.get<Auction[]>('/api/court/auctions', { params: { court } }).then(res => res.data),
  
  getStatistics: (court?: string) =>
    api.get<CourtStatistics>('/api/court/statistics', { params: { court } }).then(res => res.data),
};
