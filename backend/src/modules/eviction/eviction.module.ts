import { Module } from '@nestjs/common';
import { EvictionController } from './eviction.controller';
import { EvictionService } from './eviction.service';

@Module({
  controllers: [EvictionController],
  providers: [EvictionService],
  exports: [EvictionService],
})
export class EvictionModule {}
