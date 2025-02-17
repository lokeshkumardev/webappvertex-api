
export class CreateTransactionDto {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
  }
  