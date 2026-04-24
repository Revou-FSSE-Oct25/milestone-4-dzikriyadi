import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into one of the user accounts' })
  @ApiCreatedResponse({ type: TransactionEntity })
  deposit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: DepositDto,
  ): Promise<TransactionEntity> {
    return this.service.deposit(user.id, dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from one of the user accounts' })
  @ApiCreatedResponse({ type: TransactionEntity })
  withdraw(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: WithdrawDto,
  ): Promise<TransactionEntity> {
    return this.service.withdraw(user.id, dto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiCreatedResponse({ type: TransactionEntity })
  transfer(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TransferDto,
  ): Promise<TransactionEntity> {
    return this.service.transfer(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions visible to the user' })
  @ApiOkResponse({ type: TransactionEntity, isArray: true })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<TransactionEntity[]> {
    return this.service.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details by id' })
  @ApiOkResponse({ type: TransactionEntity })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TransactionEntity> {
    return this.service.findOne(user.id, id);
  }
}
