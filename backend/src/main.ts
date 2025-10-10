// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // 例: CORS_ORIGIN="https://seaside-app.netlify.app,http://localhost:5173"
  const allowList = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const allowOrigin = (origin?: string | null) => {
    // ★ Origin が無いリクエストは許可（curl / ヘルスチェック / 同一オリジンなど）
    if (!origin) return true;
    return (
      allowList.includes(origin) ||
      origin === 'http://localhost:5173' ||
      origin.endsWith('.netlify.app') // NetlifyのBranch/Preview対応
    );
  };

  app.enableCors({
    origin: (origin, cb) => {
      if (allowOrigin(origin)) cb(null, true);
      else cb(null, false); // ★ エラーを投げない（500を避ける）
    },
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
