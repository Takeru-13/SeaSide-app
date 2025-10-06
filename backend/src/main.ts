// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Cookie
  app.use(cookieParser());

  // 2) CORS（環境変数 CORS_ORIGIN をカンマ区切りで受ける）
  //   例: CORS_ORIGIN=http://localhost:5173,https://<your-site>.netlify.app
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,               // ← 具体的な Origin のみ許可
    credentials: true,             // ← Cookie を付けるなら必須
    methods: ['GET','PUT','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  // 3) バリデーション
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }));

  // 4) Render でのバインド先
  //    - 本番: Render が渡す PORT を使う（無ければ 8080）
  //    - 開発: 3000
  const isProd = process.env.NODE_ENV === 'production';
  const port = isProd ? Number(process.env.PORT) || 8080 : 3000;

  // Render / Docker でも外部から到達できるように 0.0.0.0 を指定
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
