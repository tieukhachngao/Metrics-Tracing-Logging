import { Module } from "@nestjs/common";
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PromController } from "./prom.controller";

@Module({
  imports: [PrometheusModule.register()],
  controllers: [PromController],
})
export class PromModule {}