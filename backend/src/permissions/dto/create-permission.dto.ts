import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Nom du module (ex: finance, rh, sales)', example: 'sales' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({ description: 'Nom de la ressource (ex: invoice, customer)', example: 'invoice' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ description: 'Action (ex: read, write, approve)', example: 'approve' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Code de permission unique (ex: sales:invoice:approve)', example: 'sales:invoice:approve' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Description explicative de la permission' })
  @IsString()
  @IsOptional()
  description?: string;
}
