// src/records/dto/upsert-record.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  IsIn,
} from 'class-validator';

/** ---- ネスト DTO（入力の形にあわせて定義） ---- */

class MealDto {
  @IsOptional() @IsBoolean()
  breakfast?: boolean;

  @IsOptional() @IsBoolean()
  lunch?: boolean;

  @IsOptional() @IsBoolean()
  dinner?: boolean;
}

class SleepDto {
  @IsOptional() @IsString()
  time?: string; // 例: '23:30'
}

class MedicineDto {
  @IsOptional() @IsArray() @IsString({ each: true })
  items?: string[]; // 例: ['vitamin', 'painkiller']
}

class ExerciseDto {
  @IsOptional() @IsArray() @IsString({ each: true })
  items?: string[];
}

class MemoDto {
  @IsOptional() @IsString()
  content?: string;
}

/** ---- Upsert の本体 DTO（部分更新を想定して全て任意） ---- */

export class UpsertRecordDto {
  // meal: { breakfast, lunch, dinner }
  @IsOptional()
  @ValidateNested()
  @Type(() => MealDto)
  meal?: MealDto;

  // sleep: { time }
  @IsOptional()
  @ValidateNested()
  @Type(() => SleepDto)
  sleep?: SleepDto;

  // medicine: { items: string[] }
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicineDto)
  medicine?: MedicineDto;

  // 'none' | 'start' | 'during'（未入力なら送らなくてOK）
  @IsOptional()
  @IsString()
  @IsIn(['none', 'start', 'during'])
  period?: 'none' | 'start' | 'during';

  // 感情 1..10（未入力なら送らなくてOK）
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  emotion?: number;


  // 常用薬を飲んだかどうか(ture/false falseがデフォルト)
  @IsOptional()
  @IsBoolean()
  tookDailyMed?: boolean;
  // exercise: { items: string[] }
  @IsOptional()
  @ValidateNested()
  @Type(() => ExerciseDto)
  exercise?: ExerciseDto;

  // memo: { content }
  @IsOptional()
  @ValidateNested()
  @Type(() => MemoDto)
  memo?: MemoDto;
}
