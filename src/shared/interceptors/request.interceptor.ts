import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        if (statusCode >= 200 && statusCode < 300) {
          // Successful response
          return {
            statusCode,
            data,
            message:data.message?data.message:"Success",
            status:true
          };
        } else {
          // Error response
          return {
            statusCode,
            error: data,
          };
        }
      }),
    );
  }
}
