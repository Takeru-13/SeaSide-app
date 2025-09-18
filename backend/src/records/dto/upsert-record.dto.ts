import { IsInt, IsJSON, IsString, IsIn } from 'class-validator';

export class UpsertRecordDto {
  // YYYY-MM-DD を params でもらうので body には不要（必要なら入れてOK）
  @IsJSON()
  meal!: string; // JSON.stringify({ breakfast, lunch, dinner })

  @IsJSON()
  sleep!: string; // JSON.stringify({ time: "23:30" })

  @IsJSON()
  medicine!: string; // JSON.stringify({ items: string[] })

  @IsString()
  @IsIn(['none', 'start', 'during'])
  period!: 'none' | 'start' | 'during';

  @IsInt()
  emotion!: number; // 1..10（UIで範囲制限済み）
}
