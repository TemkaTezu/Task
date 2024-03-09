import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();

  app.setGlobalPrefix('api');

  await app.listen(port, () => { Logger.log(`Server started on port ${port}\n`, 'NestApplication') });
}
bootstrap();
