
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });


  app.enableCors({
    origin: [
      'https://cyber-sathi-beta.vercel.app',
      'https://cyber-sathi-1enp082ej-gboss5722-3379.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
