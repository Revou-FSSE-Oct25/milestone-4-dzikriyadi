import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from '@prisma/client';

export class TransactionEntity {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  fromAccountId?: string;

  @ApiPropertyOptional()
  toAccountId?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: {
    id: string;
    fromAccountId?: string | null;
    toAccountId?: string | null;
    amount?: { toNumber(): number } | number;
    type: TransactionType;
    status: TransactionStatus;
    description?: string | null;
    createdAt: Date;
  }) {
    this.id = partial.id;
    this.fromAccountId = partial.fromAccountId ?? undefined;
    this.toAccountId = partial.toAccountId ?? undefined;
    this.amount =
      typeof partial.amount === 'number'
        ? partial.amount
        : partial.amount?.toNumber() ?? 0;
    this.type = partial.type;
    this.status = partial.status;
    this.description = partial.description ?? undefined;
    this.createdAt = partial.createdAt;
  }
}
