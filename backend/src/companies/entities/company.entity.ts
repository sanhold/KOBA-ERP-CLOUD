import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyEntity {
  @ApiProperty({ description: 'Identifiant unique (UUID)' })
  id: string;

  @ApiProperty({ description: 'Identifiant du Tenant' })
  tenantId: string;

  @ApiProperty({ description: 'Identifiant de l’organisation parente' })
  organizationId: string;

  @ApiProperty({ description: 'Nom légal / Raison sociale' })
  name: string;

  @ApiPropertyOptional({ description: 'Numéro RCCM' })
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Numéro de Compte Contribuable (NCC)' })
  taxId?: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
