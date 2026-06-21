import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class BidderService {
  constructor(private readonly storage: StorageService) {}

  payDeposit(auctionId: string, data: {
    bidderId: string;
    bidderName: string;
    amount: number;
  }) {
    return this.storage.addDeposit(auctionId, {
      ...data,
      paidAt: new Date().toISOString(),
      status: 'paid',
    });
  }

  placeBid(auctionId: string, data: {
    bidderId: string;
    bidderName: string;
    amount: number;
    isWinning?: boolean;
  }) {
    return this.storage.addBid(auctionId, {
      ...data,
      bidAt: new Date().toISOString(),
      isWinning: data.isWinning || false,
    });
  }

  applyLoan(auctionId: string, data: {
    bidderId: string;
    bidderName: string;
    loanAmount: number;
    bankName: string;
  }) {
    return this.storage.addLoanApplication(auctionId, {
      ...data,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    });
  }

  payBalance(auctionId: string, data: {
    bidderId: string;
    amount: number;
    paymentMethod: string;
    remark?: string;
  }) {
    return this.storage.addBalancePayment(auctionId, {
      ...data,
      paidAt: new Date().toISOString(),
    });
  }

  getMyDeposits(bidderId: string) {
    return this.storage.getAllAuctions()
      .flatMap(a => a.deposits)
      .filter(d => d.bidderId === bidderId);
  }

  getMyBids(bidderId: string) {
    return this.storage.getAllAuctions()
      .flatMap(a => a.bids)
      .filter(b => b.bidderId === bidderId);
  }

  getMyLoans(bidderId: string) {
    return this.storage.getAllAuctions()
      .flatMap(a => a.loanApplications)
      .filter(l => l.bidderId === bidderId);
  }
}
