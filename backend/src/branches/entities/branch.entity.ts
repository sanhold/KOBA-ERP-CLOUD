import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BranchEntity {
  @ApiProperty({ description: 'Identifiant unique (UUID)' })
  id: string;

  @ApiProperty({ description: 'Identifiant du Tenant' })
  tenantId: string;

  @ApiProperty({ description: 'Identifiant de l’entreprise parente' })
  companyId: string;

  @ApiProperty({ description: 'Nom de l’agence / établissement' })
  name: string;

  @ApiProperty({ description: 'Code de l’agence' })
  code: string;

  @ApiPropertyOptional({ description: 'Adresse physique' })
  address?: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
