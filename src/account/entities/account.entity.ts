import { ApiProperty } from '@nestjs/swagger';

export class AccountEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: {
    id: string;
    accountNumber: string;
    balance?: { toNumber(): number } | number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = partial.id;
    this.accountNumber = partial.accountNumber;
    this.balance =
      typeof partial.balance === 'number'
        ? partial.balance
        : partial.balance?.toNumber() ?? 0;
    this.currency = partial.currency;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
