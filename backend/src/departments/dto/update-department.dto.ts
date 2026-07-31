import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ description: 'Nom du département' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Identifiant du responsable / manager (UUID)' })
  @IsUUID()
  @IsOptional()
  managerId?: string;
}
