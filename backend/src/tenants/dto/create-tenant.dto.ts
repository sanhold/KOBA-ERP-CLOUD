import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'Raison sociale / Nom du souscripteur SaaS', example: 'Sanogo Holding SARL' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Slug unique d’identification (ex: sanogo-holding)', example: 'sanogo-holding' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: 'Type de plan souscrit', example: 'ENTERPRISE' })
  @IsString()
  @IsOptional()
  planType?: string;
}
