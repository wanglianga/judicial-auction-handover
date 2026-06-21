import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';
import { Auction, AuctionStatus, PropertyInfo, SeizureInfo, MortgageInfo, LeaseInfo, HouseholdInfo, DecorationInfo, ViewingRestriction, AuctionRisk } from '../../common/types';

@Injectable()
export class AuctionService {
  constructor(private readonly storage: StorageService) {}

  findAll(status?: AuctionStatus, court?: string) {
    let auctions = this.storage.getAllAuctions();
    
    if (status) {
      auctions = auctions.filter(a => a.status === status);
    }
    if (court) {
      auctions = auctions.filter(a => a.court.includes(court));
    }
    
    return auctions;
  }

  findOne(id: string) {
    return this.storage.getAuctionById(id);
  }

  create(data: {
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
  }) {
    return this.storage.createAuction({
      ...data,
      status: AuctionStatus.PENDING,
    });
  }

  updateStatus(id: string, status: AuctionStatus) {
    return this.storage.updateAuctionStatus(id, status);
  }

  getTimeline(id: string) {
    return this.storage.getTimeline(id);
  }

  publishAuction(id: string, noticeData: {
    publishDate: string;
    startPrice: number;
    depositAmount: number;
    auctionStartTime: string;
    auctionEndTime: string;
    noticeContent: string;
  }) {
    const auction = this.storage.getAuctionById(id);
    if (!auction) return null;

    const updated = this.storage.updateAuction(id, {
      auctionNotice: {
        id: '',
        ...noticeData,
      },
      status: AuctionStatus.PUBLISHED,
    });

    return updated;
  }

  confirmDeal(id: string) {
    return this.storage.confirmDeal(id);
  }
}
