import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Prénom' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Nom de famille' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Statut du compte', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
