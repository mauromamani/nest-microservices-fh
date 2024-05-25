import { IsEnum } from 'class-validator';

enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class StatusDto {
  @IsEnum([OrderStatus.PENDING, OrderStatus.DELIVERED, OrderStatus.CANCELLED])
  status: OrderStatus;
}
