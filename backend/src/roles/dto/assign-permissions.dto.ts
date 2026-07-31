import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({ description: 'Liste des IDs de permissions à affecter au rôle', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
