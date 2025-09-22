import { IsInt, Min, Max, IsObject, IsString, IsIn } from 'class-validator';

export class UpsertRecordDto {
  @IsObject() meal!: { breakfast: boolean; lunch: boolean; dinner: boolean };
  @IsObject() sleep!: { time: string };
  @IsObject() medicine!: { items: string[] };

  @IsString()
  @IsIn(['none', 'start', 'during'])
  period!: 'none' | 'start' | 'during';

  @IsInt()
  @Min(1)
  @Max(10)
  emotion!: number;
}
