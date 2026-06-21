import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class EvictionService {
  constructor(private readonly storage: StorageService) {}

  getEvictionRecords(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.evictionRecords || [];
  }

  createEvictionPlan(auctionId: string, data: {
    evictionType: 'voluntary' | 'forced';
    plannedDate: string;
    participants: string[];
    obstacles?: string[];
    remark?: string;
  }) {
    return this.storage.addEvictionRecord(auctionId, {
      ...data,
      status: 'planned',
    });
  }

  startEviction(auctionId: string, evictionId: string) {
    return this.storage.updateEvictionRecord(auctionId, evictionId, {
      status: 'in_progress',
    });
  }

  completeEviction(auctionId: string, evictionId: string, result: string, actualDate?: string) {
    return this.storage.updateEvictionRecord(auctionId, evictionId, {
      status: 'completed',
      result,
      actualDate: actualDate || new Date().toISOString(),
    });
  }

  failEviction(auctionId: string, evictionId: string, reason: string) {
    return this.storage.updateEvictionRecord(auctionId, evictionId, {
      status: 'failed',
      result: reason,
    });
  }

  handoverKeys(auctionId: string, data: {
    handoverTime: string;
    handoverPerson: string;
    receiver: string;
    keyCount: number;
    hasAccessCard: boolean;
    hasRemoteControl: boolean;
    remark?: string;
  }) {
    return this.storage.createKeyHandover(auctionId, data);
  }

  getKeyHandover(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.keyHandover;
  }

  createAcceptance(auctionId: string, data: {
    acceptanceTime: string;
    bidderName: string;
    houseCondition: string;
    hasObjections: boolean;
    objections?: string;
    signatory: string;
    remark?: string;
  }) {
    return this.storage.createAcceptanceRecord(auctionId, data);
  }

  getAcceptance(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.acceptanceRecord;
  }
}
