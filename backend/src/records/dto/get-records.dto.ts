import { IsString, IsIn } from 'class-validator';

export class GetRecordsDto {
  @IsString()
  ym!: string; // '2025-09'

  @IsIn(['me','pair'])
  scope!: 'me' | 'pair';
}
