import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Nom du groupe / Organisation', example: 'Sanogo Holding Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code unique de l’organisation', example: 'SHG' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
