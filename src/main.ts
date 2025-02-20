import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const fs = require('fs');
const path = require('path');
async function bootstrap() {
  
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/server.crt')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT as string);
}

bootstrap();
