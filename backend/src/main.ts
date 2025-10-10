// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie をパース
  app.use(cookieParser());

  // CORS 設定（本番URL/ローカルは環境変数、NetlifyのBranch/Previewは *.netlify.app を許可）
  const allowList = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const allowOrigin = (origin?: string | null) => {
    if (!origin) return false;
    return (
      allowList.includes(origin) ||
      origin === 'http://localhost:5173' ||
      origin.endsWith('.netlify.app') // ← Preview/Branch deploy 対応
    );
  };

  app.enableCors({
    origin: (origin, cb) => {
      if (allowOrigin(origin)) cb(null, true);
      else cb(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // DTO バリデーション
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Render の PORT を使用
  const port = Number(process.env.PORT) || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
