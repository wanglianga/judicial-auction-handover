import { Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BidderService } from './bidder.service';

@ApiTags('竞买人')
@Controller('api/bidder')
export class BidderController {
  constructor(private readonly bidderService: BidderService) {}

  @Post('auctions/:id/deposit')
  @ApiOperation({ summary: '缴纳保证金' })
  payDeposit(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.bidderService.payDeposit(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post('auctions/:id/bid')
  @ApiOperation({ summary: '出价竞拍' })
  placeBid(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.bidderService.placeBid(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post('auctions/:id/loan')
  @ApiOperation({ summary: '提交贷款意向' })
  applyLoan(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.bidderService.applyLoan(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post('auctions/:id/balance')
  @ApiOperation({ summary: '支付尾款' })
  payBalance(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.bidderService.payBalance(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get('deposits')
  @ApiOperation({ summary: '我的保证金记录' })
  getMyDeposits(@Query('bidderId') bidderId: string) {
    return this.bidderService.getMyDeposits(bidderId);
  }

  @Get('bids')
  @ApiOperation({ summary: '我的竞拍记录' })
  getMyBids(@Query('bidderId') bidderId: string) {
    return this.bidderService.getMyBids(bidderId);
  }

  @Get('loans')
  @ApiOperation({ summary: '我的贷款申请' })
  getMyLoans(@Query('bidderId') bidderId: string) {
    return this.bidderService.getMyLoans(bidderId);
  }
}
