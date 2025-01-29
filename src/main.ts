import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payloads to DTO instances
      whitelist: true, // Automatically removes properties that do not have decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are included
    }),
  );

  await app.listen(8000);
}
bootstrap();
