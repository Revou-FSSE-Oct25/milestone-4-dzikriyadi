import { Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  findByUserId(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  delete(id: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
