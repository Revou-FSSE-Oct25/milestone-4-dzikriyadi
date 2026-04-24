import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  findByIdForUser(userId: string, id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: {
        id,
        OR: [{ fromAccount: { userId } }, { toAccount: { userId } }],
      },
    });
  }

  findByUser(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ fromAccount: { userId } }, { toAccount: { userId } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  createDeposit(
    accountId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      this.prisma.transaction.create({
        data: {
          toAccount: { connect: { id: accountId } },
          amount,
          type: TransactionType.DEPOSIT,
          description,
        },
      }),
    ]).then(([, transaction]) => transaction);
  }

  createWithdraw(
    accountId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
      this.prisma.transaction.create({
        data: {
          fromAccount: { connect: { id: accountId } },
          amount,
          type: TransactionType.WITHDRAW,
          description,
        },
      }),
    ]).then(([, transaction]) => transaction);
  }

  createTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
      this.prisma.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      this.prisma.transaction.create({
        data: {
          fromAccount: { connect: { id: fromAccountId } },
          toAccount: { connect: { id: toAccountId } },
          amount,
          type: TransactionType.TRANSFER,
          description,
        },
      }),
    ]).then(([, , transaction]) => transaction);
  }
}
