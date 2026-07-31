import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Nom de l’entreprise' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Numéro de registre du commerce (RCCM)' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Numéro de Compte Contribuable (NCC / Tax ID)' })
  @IsString()
  @IsOptional()
  taxId?: string;
}
