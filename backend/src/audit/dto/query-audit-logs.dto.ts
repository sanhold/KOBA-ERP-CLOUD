import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryAuditLogsDto {
  @ApiPropertyOptional({ description: 'Filtrer par nom de table' })
  @IsString()
  @IsOptional()
  tableName?: string;

  @ApiPropertyOptional({ description: 'Filtrer par action (CREATE, UPDATE, DELETE...)' })
  @IsString()
  @IsOptional()
  action?: string;
}
