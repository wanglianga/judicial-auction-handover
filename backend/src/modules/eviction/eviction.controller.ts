import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EvictionService } from './eviction.service';

@ApiTags('腾退协助')
@Controller('api/eviction')
export class EvictionController {
  constructor(private readonly evictionService: EvictionService) {}

  @Get('auctions/:id/records')
  @ApiOperation({ summary: '获取腾退记录' })
  getEvictionRecords(@Param('id') auctionId: string) {
    return this.evictionService.getEvictionRecords(auctionId);
  }

  @Post('auctions/:id/plan')
  @ApiOperation({ summary: '创建腾退计划' })
  createEvictionPlan(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.evictionService.createEvictionPlan(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put('auctions/:id/records/:recordId/start')
  @ApiOperation({ summary: '开始腾退' })
  startEviction(
    @Param('id') auctionId: string,
    @Param('recordId') evictionId: string,
  ) {
    const result = this.evictionService.startEviction(auctionId, evictionId);
    if (!result) {
      throw new HttpException('腾退记录不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put('auctions/:id/records/:recordId/complete')
  @ApiOperation({ summary: '完成腾退' })
  completeEviction(
    @Param('id') auctionId: string,
    @Param('recordId') evictionId: string,
    @Body('result') result: string,
    @Body('actualDate') actualDate?: string,
  ) {
    const res = this.evictionService.completeEviction(auctionId, evictionId, result, actualDate);
    if (!res) {
      throw new HttpException('腾退记录不存在', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  @Put('auctions/:id/records/:recordId/fail')
  @ApiOperation({ summary: '腾退失败' })
  failEviction(
    @Param('id') auctionId: string,
    @Param('recordId') evictionId: string,
    @Body('reason') reason: string,
  ) {
    const result = this.evictionService.failEviction(auctionId, evictionId, reason);
    if (!result) {
      throw new HttpException('腾退记录不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get('auctions/:id/key-handover')
  @ApiOperation({ summary: '获取钥匙交接记录' })
  getKeyHandover(@Param('id') auctionId: string) {
    return this.evictionService.getKeyHandover(auctionId);
  }

  @Post('auctions/:id/key-handover')
  @ApiOperation({ summary: '钥匙交接' })
  handoverKeys(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.evictionService.handoverKeys(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get('auctions/:id/acceptance')
  @ApiOperation({ summary: '获取交房验收记录' })
  getAcceptance(@Param('id') auctionId: string) {
    return this.evictionService.getAcceptance(auctionId);
  }

  @Post('auctions/:id/acceptance')
  @ApiOperation({ summary: '交房验收' })
  createAcceptance(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.evictionService.createAcceptance(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
