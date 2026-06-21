import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class PropertyService {
  constructor(private readonly storage: StorageService) {}

  updateArrears(auctionId: string, data: {
    propertyFeeArrears: number;
    waterArrears?: number;
    electricityArrears?: number;
    gasArrears?: number;
    heatingArrears?: number;
    hasAccessControl: boolean;
    parkingSpace?: string;
    decorationDeposit?: number;
  }) {
    return this.storage.updatePropertyArrears(auctionId, {
      ...data,
      recordedAt: new Date().toISOString(),
    });
  }

  getArrears(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.propertyArrears;
  }
}
