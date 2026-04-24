import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, PrismaService],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
