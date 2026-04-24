import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, PrismaService],
})
export class TransactionModule {}
