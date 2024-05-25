import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';

export class PaginateOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum([OrderStatus.PENDING, OrderStatus.DELIVERED, OrderStatus.CANCELLED])
  status?: OrderStatus;
}
