import 'dotenv/config';
import * as joi from 'joi';

interface IEnv {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}

const envSchema = joi
  .object<IEnv>({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const {
  PORT,
  PRODUCTS_MICROSERVICE_HOST,
  PRODUCTS_MICROSERVICE_PORT,
}: IEnv = value;
