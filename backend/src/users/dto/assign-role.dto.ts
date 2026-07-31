import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: 'Identifiant du Rôle (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiPropertyOptional({ description: 'Identifiant de la Société pour restreindre le rôle (UUID)' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Identifiant de la Filiale pour restreindre le rôle (UUID)' })
  @IsUUID()
  @IsOptional()
  branchId?: string;
}
