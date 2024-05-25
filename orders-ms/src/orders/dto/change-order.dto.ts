import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class ChangeOrderDto {
  @IsUUID()
  id: string;

  @IsEnum([OrderStatus.PENDING, OrderStatus.DELIVERED, OrderStatus.CANCELLED])
  status: OrderStatus;
}
