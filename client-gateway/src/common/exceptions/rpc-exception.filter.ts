import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      return response.status(rpcError.status).json({
        status: rpcError.status,
        message: rpcError.message,
      });
    }

    console.log('rpcError', rpcError);

    return response.status(401).json({
      status: 401,
      message: 'Unauthorized :(',
    });
  }
}
