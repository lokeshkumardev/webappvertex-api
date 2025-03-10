export class AddMoneyDto {
  amount: number;
  riderId: string;
}

export class DeductMoneyDto {
  amount: number;
  title: string;
  riderId: string;
}
