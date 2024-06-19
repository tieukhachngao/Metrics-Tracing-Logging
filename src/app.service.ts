import { Inject, Injectable, Logger } from '@nestjs/common';
import { LokiLogger } from "src/monitoring/Logger/LokiLogger";
@Injectable()
export class AppService {
  constructor(@Inject(LokiLogger) private readonly logger: LokiLogger) {}

  getTromCho(): string {
    this.logger.log('trom-cho','Trộm chó vào chuồng chó');
    return 'Thằng trộm vào nhà bắt chó';
  }
  getTromGa():string{
    this.logger.log('trom-ga','Trộm gà vào chuồng gà');
    return 'Thằng trộm vào nhà bắt gà'
  }
}
