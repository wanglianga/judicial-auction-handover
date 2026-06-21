import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';

@ApiTags('评估机构')
@Controller('api/evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get('auctions/:id/report')
  @ApiOperation({ summary: '获取评估报告' })
  getEvaluationReport(@Param('id') auctionId: string) {
    return this.evaluationService.getEvaluationReport(auctionId);
  }

  @Post('auctions/:id/report')
  @ApiOperation({ summary: '提交评估报告' })
  submitEvaluationReport(@Param('id') auctionId: string, @Body() data: any) {
    const result = this.evaluationService.submitEvaluationReport(auctionId, data);
    if (!result) {
      throw new HttpException('拍卖标的不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
