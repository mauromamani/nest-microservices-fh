import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ORDERS_MICROSERVICE_HOST,
  ORDERS_MICROSERVICE_PORT,
  ORDERS_SERVICE,
} from 'src/config';

@Module({
  controllers: [OrdersController],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          port: ORDERS_MICROSERVICE_PORT,
          host: ORDERS_MICROSERVICE_HOST,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
