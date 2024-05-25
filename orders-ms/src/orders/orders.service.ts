import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { PaginateOrderDto } from './dto/paginate-order.dto';
import { ChangeOrderDto } from './dto/change-order.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: {
        status: createOrderDto.status,
        total_amount: createOrderDto.totalAmount,
        total_items: createOrderDto.totalItems,
        paid: createOrderDto.paid,
      },
    });
  }

  async findAll(paginateOrderDto: PaginateOrderDto) {
    const { status, limit, page } = paginateOrderDto;

    const total = await this.order.count({ where: { status } });
    const lastPage = Math.ceil(total / limit);

    const data = await this.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { status },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: { id },
    });

    if (!order) {
      this.logger.warn(`Order #${id} not found`);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order #${id} not found`,
      });
    }

    return order;
  }

  async changeStatus(changeOrderDto: ChangeOrderDto) {
    const order = await this.findOne(changeOrderDto.id);

    if (order.status === changeOrderDto.status) {
      return order;
    }

    return this.order.update({
      where: { id: changeOrderDto.id },
      data: {
        status: changeOrderDto.status,
      },
    });
  }
}
