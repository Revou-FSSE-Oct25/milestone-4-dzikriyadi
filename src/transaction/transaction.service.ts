import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepository } from '../account/account.repository';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async deposit(userId: string, dto: DepositDto): Promise<TransactionEntity> {
    const account = await this.accountRepository.findById(dto.toAccountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const transaction = await this.transactionRepository.createDeposit(
      account.id,
      dto.amount,
      dto.description,
    );

    return new TransactionEntity(transaction);
  }

  async withdraw(userId: string, dto: WithdrawDto): Promise<TransactionEntity> {
    const account = await this.accountRepository.findById(dto.fromAccountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (account.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = await this.transactionRepository.createWithdraw(
      account.id,
      dto.amount,
      dto.description,
    );

    return new TransactionEntity(transaction);
  }

  async transfer(userId: string, dto: TransferDto): Promise<TransactionEntity> {
    const from = await this.accountRepository.findById(dto.fromAccountId);
    const to = await this.accountRepository.findById(dto.toAccountId);

    if (!from || !to) {
      throw new NotFoundException('Account not found');
    }

    if (from.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (from.id === to.id) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    if (from.balance.toNumber() < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = await this.transactionRepository.createTransfer(
      from.id,
      to.id,
      dto.amount,
      dto.description,
    );

    return new TransactionEntity(transaction);
  }

  async findAll(userId: string): Promise<TransactionEntity[]> {
    const transactions = await this.transactionRepository.findByUser(userId);
    return transactions.map((transaction) => new TransactionEntity(transaction));
  }

  async findOne(userId: string, id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const authorizedTransaction = await this.transactionRepository.findByIdForUser(
      userId,
      id,
    );

    if (!authorizedTransaction) {
      throw new ForbiddenException('Access denied');
    }

    return new TransactionEntity(authorizedTransaction);
  }
}
