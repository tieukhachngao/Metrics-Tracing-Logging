import { Controller, Get, Res } from "@nestjs/common";
import { PrometheusController } from "@willsoto/nestjs-prometheus";

@Controller("metrics")
export class PromController extends PrometheusController {
  @Get()
  metrics(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
