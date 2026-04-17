import { TransactionStatus, TransactionType } from '@prisma/client';

export class TransactionEntity {
  id: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  createdAt: Date;

  constructor(partial: any) {
    this.id = partial.id;
    this.fromAccountId = partial.fromAccountId;
    this.toAccountId = partial.toAccountId;
    this.amount = partial.amount?.toNumber(); // 🔥 Decimal fix
    this.type = partial.type;
    this.status = partial.status;
    this.description = partial.description;
    this.createdAt = partial.createdAt;
  }
}
