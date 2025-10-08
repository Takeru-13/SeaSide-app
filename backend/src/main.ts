
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',').map(s => s.trim()).filter(Boolean);
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET','PUT','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ★常に Render の PORT を使う
  const port = Number(process.env.PORT) || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
