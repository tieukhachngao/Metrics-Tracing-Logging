import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/tromcho')
  getTromCho(): string {
    return this.appService.getTromCho();
  }

  @Get('/tromga')
  getTromGa(): string{
    return this.appService.getTromGa();
  }
}
