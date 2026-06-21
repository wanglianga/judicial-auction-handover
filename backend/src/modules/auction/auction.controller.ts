import { Controller, Get, Post, Put, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { AuctionStatus } from '../../common/types';

@ApiTags('拍卖标的')
@Controller('api/auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  @ApiOperation({ summary: '获取拍卖标的列表' })
  @ApiQuery({ name: 'status', required: false, enum: AuctionStatus })
  findAll(
    @Query('status') status?: AuctionStatus,
    @Query('court') court?: string,
  ) {
    return this.auctionService.findAll(status, court);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取拍卖标的详情' })
  findOne(@Param('id') id: string) {
    const auction = this.auctionService.findOne(id);
    if (!auction) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return auction;
  }

  @Post()
  @ApiOperation({ summary: '创建拍卖标的（法院发布）' })
  create(@Body() data: any) {
    return this.auctionService.create(data);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新拍卖状态' })
  updateStatus(@Param('id') id: string, @Body('status') status: AuctionStatus) {
    const result = this.auctionService.updateStatus(id, status);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布拍卖公告' })
  publishAuction(@Param('id') id: string, @Body() noticeData: any) {
    const result = this.auctionService.publishAuction(id, noticeData);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post(':id/confirm-deal')
  @ApiOperation({ summary: '成交确认' })
  confirmDeal(@Param('id') id: string) {
    const result = this.auctionService.confirmDeal(id);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: '获取拍卖时间线' })
  getTimeline(@Param('id') id: string) {
    return this.auctionService.getTimeline(id);
  }
}
