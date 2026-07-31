import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Identifiant du Tenant (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Refresh Token valide à renouveler' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
