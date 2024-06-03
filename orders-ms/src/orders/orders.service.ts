import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginateOrderDto } from './dto/paginate-order.dto';
import { ChangeOrderDto } from './dto/change-order.dto';
import { PRODUCT_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productIds = createOrderDto.items.map((item) => item.productId);

      const products = await firstValueFrom(
        this.productsClient.send({ cmd: 'VALIDATE_PRODUCTS' }, productIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // crear transacción de base de datos
      const order = await this.order.create({
        data: {
          total_amount: totalAmount,
          total_items: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                product_id: item.productId.toString(),
                quantity: item.quantity,
                price: products.find((product) => product.id === item.productId)
                  .price,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              product_id: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id == item.product_id).name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
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
      include: { OrderItem: true },
    });

    if (!order) {
      this.logger.warn(`Order #${id} not found`);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order #${id} not found`,
      });
    }

    const productIds = order.OrderItem.map((item) => Number(item.product_id));
    const products = await firstValueFrom(
      this.productsClient.send({ cmd: 'VALIDATE_PRODUCTS' }, productIds),
    );

    return {
      ...order,
      OrderItem: order.OrderItem.map((item) => ({
        ...item,
        name: products.find((product) => product.id == item.product_id).name,
      })),
    };
  }

  async changeStatus(changeOrderDto: ChangeOrderDto) {
    const order = await this.findOne(changeOrderDto.id);

    // if (order.status === changeOrderDto.status) {
    //   return order;
    // }

    return this.order.update({
      where: { id: changeOrderDto.id },
      data: {
        status: changeOrderDto.status,
      },
    });
  }
}
