import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Nom usuel de l’entreprise' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Raison sociale légale' })
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Forme juridique OHADA (ex: SARL, SA, SAS, SUARL)' })
  @IsString()
  @IsOptional()
  legalForm?: string;

  @ApiPropertyOptional({ description: 'Numéro de registre du commerce OHADA (RCCM)' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Numéro de Compte Contribuable (NCC / Tax ID)' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Devise de tenue de compte' })
  @IsString()
  @IsOptional()
  currency?: string;
}
