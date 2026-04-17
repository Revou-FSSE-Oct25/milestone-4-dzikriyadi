export class AccountEntity {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: any) {
    this.id = partial.id;
    this.accountNumber = partial.accountNumber;
    this.balance = partial.balance?.toNumber(); // 🔥 FIX DI SINI
    this.currency = partial.currency;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
