import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Identifiant de l’organisation parente (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Nom usuel de l’entreprise', example: 'KOBA Retail Côte d’Ivoire' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Raison sociale légale', example: 'KOBA Retail Côte d’Ivoire SARL' })
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Forme juridique OHADA (ex: SARL, SA, SAS, SUARL)', example: 'SARL' })
  @IsString()
  @IsOptional()
  legalForm?: string;

  @ApiPropertyOptional({ description: 'Numéro de registre du commerce OHADA (RCCM)', example: 'CI-ABJ-03-2026-B12-00123' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Numéro de Compte Contribuable (NCC / Tax ID)', example: '2601234 A' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Devise de tenue de compte (ex: XOF, EUR, USD)', example: 'XOF' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Identifiant du pays (UUID)' })
  @IsUUID()
  @IsOptional()
  countryId?: string;
}
