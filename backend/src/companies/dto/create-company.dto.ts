import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Identifiant de l’organisation parente (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Raison sociale / Nom légal de l’entreprise', example: 'KOBA Retail Côte d’Ivoire SARL' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Numéro de registre du commerce (RCCM)' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Numéro de Compte Contribuable (NCC / Tax ID)' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Identifiant du pays (UUID)' })
  @IsUUID()
  @IsOptional()
  countryId?: string;
}
