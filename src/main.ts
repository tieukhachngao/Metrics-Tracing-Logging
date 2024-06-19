import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { otelSDK } from './monitoring/Otel/tracing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(AppModule,{
    bufferLogs: true,
  });
  const swaggerConfig = new DocumentBuilder()
  .setTitle("Pham Quang Loc VN Template")
  .setDescription("Hello Pham Quang Loc VN")
  .setVersion("1.0")
  .build();

const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

SwaggerModule.setup("api-docs", app, swaggerDocument);
  await app.listen(3000);
}
bootstrap();
