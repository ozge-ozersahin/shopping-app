import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}))
  // Allow requests from the local frontend during development
  app.enableCors({
    origin: 'http://localhost:8081',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
