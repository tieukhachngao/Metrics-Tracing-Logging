import { Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromModule } from "./monitoring/Prometheus/prom.module";
import { LoggingModule } from "./monitoring/Logger/logger.module";
import { LokiLogger } from './monitoring/Logger/LokiLogger';

@Module({
  imports: [
    PromModule,
    LoggingModule
  ],
  controllers: [AppController],
  providers: [AppService, LokiLogger, Logger],
})
export class AppModule {}
