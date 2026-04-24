import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty()
  @IsString()
  fromAccountId: string;

  @ApiProperty()
  @IsString()
  toAccountId: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
