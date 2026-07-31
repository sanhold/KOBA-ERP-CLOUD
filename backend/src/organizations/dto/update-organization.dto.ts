import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Nom de l’organisation' })
  @IsString()
  @IsOptional()
  name?: string;
}
