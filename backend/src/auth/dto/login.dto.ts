import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Identifiant du Tenant (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Adresse email', example: 'moussa.sanogo@koba.cloud' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe', example: 'P@ssword2026!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
