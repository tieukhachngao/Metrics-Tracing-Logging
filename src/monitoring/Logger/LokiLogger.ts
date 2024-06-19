import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
require("dotenv").config();
@Injectable()
export class LokiLogger {
  constructor(private readonly logger: Logger) {}

  error(message: any, trace?: string, context?: string) {
    this.sendToLoki("error", message, trace, context);
  }

  warn(message: any, context?: string) {
    this.sendToLoki("warn", message, undefined, context);
  }

  log(message: any, context?: string) {
    this.sendToLoki("info", message, undefined, context);
  }

  private async sendToLoki(
    level: string,
    message: any,
    trace?: string,
    context?: string
  ) {
    try {
      const lokiData = {
        streams: [
          {
            stream: {
              env: "nestjs",
              level: level,
              context: context,
              trace: trace,
            },
            values: [[(Date.now() * 1e6).toString(), message]],
          },
        ],
      };

      await axios.post(`http://${process.env.LOKI_SERVER_URL}/loki/api/v1/push`, lokiData);
      this.logger.log(`[${level}] Log sent to Loki server successfully.`);
    } catch (error) {
      this.logger.error("Error sending log to Loki server:", error);
    }
  }
}
