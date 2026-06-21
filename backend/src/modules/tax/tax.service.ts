import { Injectable } from '@nestjs/common';
import { StorageService } from '../../common/storage.service';

@Injectable()
export class TaxService {
  constructor(private readonly storage: StorageService) {}

  calculateTax(auctionId: string, data: {
    deedTax: number;
    vatDifference: number;
    individualIncomeTax?: number;
    stampDuty?: number;
    transferMaterials: string[];
    calculator: string;
  }) {
    const totalTax = data.deedTax + data.vatDifference + 
      (data.individualIncomeTax || 0) + (data.stampDuty || 0);

    return this.storage.createTaxCalculation(auctionId, {
      ...data,
      totalTax,
      calculatedAt: new Date().toISOString(),
    });
  }

  getTaxCalculation(auctionId: string) {
    const auction = this.storage.getAuctionById(auctionId);
    return auction?.taxCalculation;
  }
}
