import axios from "axios";
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  httpService: any;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === "http") {
      return this.logHttpCall(context, next);
    }
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get("user-agent") || "";
    const { ip, method, url, body, query, params } = request;
    const correlationKey = uuidv4();
    const userId = request.user?.id || 'anonymous';
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    this.logger.log(
      `[${correlationKey}] ${userAgent} ${ip} ${method} ${url} ${JSON.stringify(body)} ${JSON.stringify(query)} ${JSON.stringify(params)} ${userId}`
    );
    const now = Date.now();
    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        const logData = `[${correlationKey}] ${userAgent} ${ip} ${method} ${url} ${JSON.stringify(body,)} ${JSON.stringify(query)} ${JSON.stringify(params)} ${userId}  ${Date.now() - now}ms`

        await this.pushToLoki(logData,className,handlerName);
      })
    );
  }

  private async pushToLoki(logData: any,contextStream: any, traceStream: any) {
    try {
      const lokiData = {
        streams: [
          {
            stream: {
              env: "nestjs",
              context: contextStream,
              trace: traceStream,
            },
            values: [[(Date.now() * 1e6).toString(), logData]],
          },
        ],
      };

      await axios.post(`http://${process.env.LOKI_SERVER_URL}/loki/api/v1/push`, lokiData);
      this.logger.log("Log sent to Loki server successfully.");
    } catch (error) {
      this.logger.error("Error sending log to Loki server:", error);
    }
  }
}
