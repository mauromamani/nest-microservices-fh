import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { catchError } from 'rxjs';
import { PaginateOrderDto } from './dto/paginate-order.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('CREATE', createOrderDto);
  }

  @Get()
  findAllOrders(@Query() paginateOrderDto: PaginateOrderDto) {
    return this.ordersClient.send('FIND_ALL', paginateOrderDto);
  }

  @Get(':id')
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('FIND_ONE', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersClient
      .send('CHANGE_STATUS', {
        id,
        status: statusDto.status,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
