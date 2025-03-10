export class CreateRiderTransactionDto {
  riderId: string;
  amount: number;
  type: 'credit' | 'debit';
}
