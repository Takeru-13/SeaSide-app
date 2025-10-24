// backend/src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY が設定されていません');
    }

    this.apiKey = apiKey;
  }

  async generateMonthlySummary(records: any[]): Promise<string> {
   const prompt = `
あなたは優しく寄り添ってくれるパーソナルアシスタントです。
以下は1ヶ月分の健康記録データです。200文字程度でこ要約してください。

データ:
${JSON.stringify(records, null, 2)}

要約に含める内容:
- 今月の頑張りを褒める
- 感情の変化傾向
- 睡眠・食事・運動の習慣
- 上記の関連性に関する考察
- 次月に向けた優しいアドバイスや励まし
`;
    try {
      // gemini-2.5-flash を使用
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${error}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI要約の生成に失敗しました');
    }
  }
}