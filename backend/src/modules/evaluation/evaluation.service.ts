import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class EvaluationService {
  constructor(private readonly storage: StorageService) {}

  getEvaluationReport(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.evaluationReport;
  }

  submitEvaluationReport(auctionId: string, data: {
    agencyName: string;
    evaluationValue: number;
    reportDate: string;
    reportFile?: string;
  }) {
    const auction = this.storage.getAuctionById(auctionId);
    if (!auction) return null;

    const report = {
      id: uuidv4(),
      ...data,
    };

    this.storage.updateAuction(auctionId, {
      evaluationReport: report,
    });

    return report;
  }
}
