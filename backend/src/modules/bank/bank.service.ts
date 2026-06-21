import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class BankService {
  constructor(private readonly storage: StorageService) {}

  getLoanApplications(bankName?: string) {
    let loans = this.storage.getAllAuctions()
      .flatMap(a => a.loanApplications.map(l => ({ ...l, auctionTitle: a.title, caseNumber: a.caseNumber })));
    
    if (bankName) {
      loans = loans.filter(l => l.bankName === bankName);
    }
    
    return loans;
  }

  approveLoan(auctionId: string, loanId: string) {
    return this.storage.updateLoanApplication(auctionId, loanId, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    });
  }

  rejectLoan(auctionId: string, loanId: string, reason: string) {
    return this.storage.updateLoanApplication(auctionId, loanId, {
      status: 'rejected',
      rejectionReason: reason,
    });
  }

  disburseLoan(auctionId: string, loanId: string) {
    return this.storage.updateLoanApplication(auctionId, loanId, {
      status: 'disbursed',
      disbursedAt: new Date().toISOString(),
    });
  }
}
