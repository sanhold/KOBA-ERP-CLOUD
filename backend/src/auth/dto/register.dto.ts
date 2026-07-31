import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Prénom de l’utilisateur', example: 'Moussa' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom de famille de l’utilisateur', example: 'Sanogo' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Adresse email unique de l’utilisateur', example: 'moussa.sanogo@koba.cloud' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone', example: '+2250707070707' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Mot de passe sécurisé (minimum 8 caractères)', example: 'P@ssword2026!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Identifiant du Tenant (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({ description: 'Identifiant de la Société/Entreprise (UUID)' })
  @IsUUID()
  @IsOptional()
  companyId?: string;
}
