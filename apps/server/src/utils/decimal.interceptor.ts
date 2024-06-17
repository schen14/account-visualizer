import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import { Observable, map } from "rxjs";

@Injectable()
export class DecimalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(data => this.transformDecimalToNumber(data)));
  }

  private transformDecimalToNumber(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformDecimalToNumber(item));
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (data[key] instanceof Decimal) {
          data[key] = data[key].toNumber();
        } else if (typeof data[key] === 'object') {
          data[key] = this.transformDecimalToNumber(data[key]);
        }
      }
    }
    return data;
  }
}