import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginateOrderDto } from './dto/paginate-order.dto';
import { ChangeOrderDto } from './dto/change-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('CREATE')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('FIND_ALL')
  findAll(@Payload() paginateOrderDto: PaginateOrderDto) {
    return this.ordersService.findAll(paginateOrderDto);
  }

  @MessagePattern('FIND_ONE')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('CHANGE_STATUS')
  changeStatus(@Payload() changeOrderDto: ChangeOrderDto) {
    return this.ordersService.changeStatus(changeOrderDto);
  }
}
