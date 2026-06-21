import { Controller, Get, Put, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BankService } from './bank.service';

@ApiTags('银行')
@Controller('api/bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('loans')
  @ApiOperation({ summary: '获取贷款申请列表' })
  getLoanApplications(@Query('bankName') bankName?: string) {
    return this.bankService.getLoanApplications(bankName);
  }

  @Put('auctions/:auctionId/loans/:loanId/approve')
  @ApiOperation({ summary: '审批通过贷款' })
  approveLoan(
    @Param('auctionId') auctionId: string,
    @Param('loanId') loanId: string,
  ) {
    const result = this.bankService.approveLoan(auctionId, loanId);
    if (!result) {
      throw new HttpException('贷款申请不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put('auctions/:auctionId/loans/:loanId/reject')
  @ApiOperation({ summary: '拒绝贷款申请' })
  rejectLoan(
    @Param('auctionId') auctionId: string,
    @Param('loanId') loanId: string,
    @Body('reason') reason: string,
  ) {
    const result = this.bankService.rejectLoan(auctionId, loanId, reason);
    if (!result) {
      throw new HttpException('贷款申请不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put('auctions/:auctionId/loans/:loanId/disburse')
  @ApiOperation({ summary: '贷款放款' })
  disburseLoan(
    @Param('auctionId') auctionId: string,
    @Param('loanId') loanId: string,
  ) {
    const result = this.bankService.disburseLoan(auctionId, loanId);
    if (!result) {
      throw new HttpException('贷款申请不存在', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
