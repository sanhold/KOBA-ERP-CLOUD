import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepartmentEntity {
  @ApiProperty({ description: 'Identifiant unique (UUID)' })
  id: string;

  @ApiProperty({ description: 'Identifiant du Tenant' })
  tenantId: string;

  @ApiProperty({ description: 'Identifiant de la filiale parente' })
  branchId: string;

  @ApiProperty({ description: 'Nom du département' })
  name: string;

  @ApiProperty({ description: 'Code du département' })
  code: string;

  @ApiPropertyOptional({ description: 'Identifiant du responsable / manager' })
  managerId?: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
