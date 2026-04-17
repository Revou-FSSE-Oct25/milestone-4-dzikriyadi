import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  currency?: string; // default IDR

  @IsOptional()
  @IsString()
  accountNumber?: string; // nanti bisa auto generate di service
}
