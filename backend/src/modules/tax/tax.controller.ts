import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaxService } from './tax.service';

@ApiTags('税务窗口')
@Controller('api/tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('auctions/:id/calculation')
  @ApiOperation({ summary: '获取税费测算结果' })
  getTaxCalculation(@Param('id') auctionId: string) {
    return this.taxService.getTaxCalculation(auctionId);
  }

  @Post('auctions/:id/calculate')
  @ApiOperation({ summary: '计算税费' })
  calculateTax(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.taxService.calculateTax(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
