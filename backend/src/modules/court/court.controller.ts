import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourtService } from './court.service';

@ApiTags('法院执行局')
@Controller('api/court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get('auctions')
  @ApiOperation({ summary: '获取法院拍卖标的列表' })
  getCourtAuctions(@Query('court') court: string) {
    return this.courtService.getCourtAuctions(court);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取统计数据' })
  getStatistics(@Query('court') court?: string) {
    return this.courtService.getStatistics(court);
  }
}
