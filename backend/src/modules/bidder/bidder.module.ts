import { Module } from '@nestjs/common';
import { BidderController } from './bidder.controller';
import { BidderService } from './bidder.service';

@Module({
  controllers: [BidderController],
  providers: [BidderService],
  exports: [BidderService],
})
export class BidderModule {}
