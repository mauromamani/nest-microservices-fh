import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  PRODUCTS_MICROSERVICE_HOST,
  PRODUCTS_MICROSERVICE_PORT,
  PRODUCT_SERVICE,
} from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
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
export class ProductsModule {}
