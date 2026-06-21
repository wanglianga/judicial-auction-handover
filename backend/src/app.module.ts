import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuctionModule } from './modules/auction/auction.module';
import { BidderModule } from './modules/bidder/bidder.module';
import { BankModule } from './modules/bank/bank.module';
import { PropertyModule } from './modules/property/property.module';
import { TaxModule } from './modules/tax/tax.module';
import { EvictionModule } from './modules/eviction/eviction.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { CourtModule } from './modules/court/court.module';

@Module({
  imports: [
    CommonModule,
    AuctionModule,
    BidderModule,
    BankModule,
    PropertyModule,
    TaxModule,
    EvictionModule,
    EvaluationModule,
    CourtModule,
  ],
})
export class AppModule {}
