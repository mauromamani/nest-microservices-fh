import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count({ where: { status: true } });
    const lastPage = Math.ceil(total / limit);

    const data = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        status: true,
      },
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

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, status: true },
    });

    if (!product) {
      this.logger.warn(`Product #${id} not found`);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product #${id} not found`,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: Omit<UpdateProductDto, 'id'>) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: { status: false },
    });

    return product;
  }
}
