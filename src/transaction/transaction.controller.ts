import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('deposit')
  deposit(
    @Req() req: Request,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.service.deposit(req['user']?.id, dto);
  }

  @Post('withdraw')
  withdraw(
    @Req() req: Request,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.service.withdraw(req['user']?.id, dto);
  }

  @Post('transfer')
  transfer(
    @Req() req: Request,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.service.transfer(req['user']?.id, dto);
  }

  @Get()
  findAll(@Req() req: Request): Promise<TransactionEntity[]> {
    return this.service.findAll(req['user']?.id);
  }

  @Get(':id')
  findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<TransactionEntity> {
    return this.service.findOne(req['user']?.id, id);
  }
}
