// upsert-record.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Max, Min, ValidateNested, IsIn } from 'class-validator';

class ExerciseDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];
}

class MemoDto {
  @IsString()
  @IsOptional()
  content?: string;
}

export class UpsertRecordDto {
  // 既存フィールド（例）
  meal!: { breakfast: boolean; lunch: boolean; dinner: boolean };
  sleep!: { time: string };
  medicine!: { items: string[] };

  @IsString()
  @IsIn(['none', 'start', 'during'])
  period!: 'none' | 'start' | 'during';

  @IsInt() @Min(1) @Max(10)
  emotion!: number;

  @ValidateNested()
  @Type(() => ExerciseDto)
  @IsOptional()
  exercise?: ExerciseDto;

  @ValidateNested()
  @Type(() => MemoDto)
  @IsOptional()
  memo?: MemoDto;
}
