import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PropertyService } from './property.service';

@ApiTags('物业')
@Controller('api/property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get('auctions/:id/arrears')
  @ApiOperation({ summary: '获取物业欠费信息' })
  getArrears(@Param('id') auctionId: string) {
    return this.propertyService.getArrears(auctionId);
  }

  @Put('auctions/:id/arrears')
  @ApiOperation({ summary: '更新物业欠费及相关信息' })
  updateArrears(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.propertyService.updateArrears(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
