import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ApiExceptionFilter, ApiResponseInterceptor } from './shared/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET',
  });
  app.setGlobalPrefix('api');
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  if (!port) {
    throw new Error(`Environment variables are missing`);
  }
  await app.listen(port);
}
bootstrap();
