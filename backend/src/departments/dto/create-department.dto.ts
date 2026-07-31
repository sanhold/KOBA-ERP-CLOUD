import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Identifiant de la filiale / agence parente (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ description: 'Nom du département / service interne', example: 'Direction Comptable & Financière' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code unique du département', example: 'DEP-FIN' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Identifiant du responsable / manager (UUID)' })
  @IsUUID()
  @IsOptional()
  managerId?: string;
}
