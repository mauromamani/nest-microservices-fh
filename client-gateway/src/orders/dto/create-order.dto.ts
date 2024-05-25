import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  @IsEnum(['PENDING', 'DELIVERED', 'CANCELLED'])
  @IsOptional()
  status = 'PENDING';

  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
