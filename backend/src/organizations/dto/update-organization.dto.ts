import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Nom de l’organisation' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'URL du logo de l’organisation' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ description: 'Adresse du siège de l’organisation' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone principal' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Adresse email officielle de contact' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
