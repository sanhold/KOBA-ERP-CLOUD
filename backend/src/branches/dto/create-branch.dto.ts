import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Identifiant de la société parente (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ description: 'Nom de la filiale / agence / établissement', example: 'Agence Cocody Abidjan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code unique de l’agence', example: 'AG-COC' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Identifiant de la ville (UUID)' })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({ description: 'Adresse physique' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;
}
