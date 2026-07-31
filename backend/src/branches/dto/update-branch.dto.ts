import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto {
  @ApiPropertyOptional({ description: 'Nom de l’agence' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Adresse physique' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;
}
