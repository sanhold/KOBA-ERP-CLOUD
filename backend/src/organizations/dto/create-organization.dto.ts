import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Nom du groupe / Organisation', example: 'Sanogo Holding Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code unique de l’organisation', example: 'SHG' })
  @IsString()
  @IsNotEmpty()
  code: string;

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
