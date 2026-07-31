import { ApiProperty } from '@nestjs/swagger';

export class OrganizationEntity {
  @ApiProperty({ description: 'Identifiant unique (UUID)' })
  id: string;

  @ApiProperty({ description: 'Identifiant du Tenant' })
  tenantId: string;

  @ApiProperty({ description: 'Nom de l’organisation / holding' })
  name: string;

  @ApiProperty({ description: 'Code unique de l’organisation' })
  code: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
