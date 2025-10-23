// backend/src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY が設定されていません');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateMonthlySummary(records: any[]): Promise<string> {
    const prompt = `
      以下は1ヶ月分の健康記録データです。
      日本語で簡潔に要約してください（200文字程度）。

      データ:
      ${JSON.stringify(records, null, 2)}

      要約のポイント:
      - 感情の変化傾向
      - 睡眠パターン
      - 食事・運動の習慣
      - 気づきやアドバイス
    `;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI要約の生成に失敗しました');
    }
  }
}


