import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config/services';
import {
  PRODUCTS_MICROSERVICE_HOST,
  PRODUCTS_MICROSERVICE_PORT,
} from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: PRODUCTS_MICROSERVICE_HOST,
          port: PRODUCTS_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
