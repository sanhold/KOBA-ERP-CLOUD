import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Identifiant du Tenant (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Nom lisible du rôle', example: 'Directeur Financier' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code unique du rôle', example: 'DIRECTEUR_FINANCIER' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Description des responsabilités du rôle' })
  @IsString()
  @IsOptional()
  description?: string;
}
