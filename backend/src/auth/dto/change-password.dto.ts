import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mot de passe actuel' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'Nouveau mot de passe (minimum 8 caractères)', example: 'NouveauP@ssword2026!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
