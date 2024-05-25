import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';

export class PaginateOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['PENDING', 'DELIVERED', 'CANCELLED'])
  status: any;
}
