// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const allowList = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',').map(s => s.trim()).filter(Boolean);
  
  const allowOrigin = (origin?: string|null) =>
    !origin // 同一オリジン/curl/ヘルスチェック等は許可
    || allowList.includes(origin)
    || origin === 'http://localhost:5173'
    || origin.endsWith('.netlify.app'); // ★ Branch / Preview の Origin を許可
  
  app.enableCors({
    origin: (origin, cb) => cb(null, allowOrigin(origin)),
    credentials: true,
    methods: ['GET','PUT','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
