import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';
import { AuctionStatus } from '../../common/types';

@Injectable()
export class CourtService {
  constructor(private readonly storage: StorageService) {}

  getCourtAuctions(court: string) {
    return this.storage.getAllAuctions().filter(a => a.court === court);
  }

  getStatistics(court?: string) {
    let auctions = this.storage.getAllAuctions();
    if (court) {
      auctions = auctions.filter(a => a.court === court);
    }

    return {
      total: auctions.length,
      pending: auctions.filter(a => a.status === AuctionStatus.PENDING).length,
      published: auctions.filter(a => a.status === AuctionStatus.PUBLISHED).length,
      bidding: auctions.filter(a => a.status === AuctionStatus.BIDDING).length,
      ended: auctions.filter(a => a.status === AuctionStatus.ENDED).length,
      paid: auctions.filter(a => a.status === AuctionStatus.PAID).length,
      evictionInProgress: auctions.filter(a => a.status === AuctionStatus.EVICTION_IN_PROGRESS).length,
      evicted: auctions.filter(a => a.status === AuctionStatus.EVICTED).length,
      completed: auctions.filter(a => a.status === AuctionStatus.COMPLETED).length,
      totalTransactionValue: auctions
        .filter(a => a.transactionPrice)
        .reduce((sum, a) => sum + (a.transactionPrice || 0), 0),
    };
  }
}
