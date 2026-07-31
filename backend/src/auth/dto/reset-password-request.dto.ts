import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ description: 'Identifiant du Tenant (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Adresse email du compte à réinitialiser' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
