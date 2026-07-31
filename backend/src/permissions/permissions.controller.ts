import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { Permissions } from './decorators/permissions.decorator';

@ApiTags('Permissions (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions('system:permissions:create')
  @ApiOperation({ summary: 'Créer une nouvelle permission système' })
  @ApiResponse({ status: 201, description: 'Permission créée' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @Permissions('system:permissions:read')
  @ApiOperation({ summary: 'Lister le catalogue de toutes les permissions' })
  @ApiResponse({ status: 200, description: 'Catalogue des permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions('system:permissions:read')
  @ApiOperation({ summary: 'Détails d’une permission par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la permission' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
}
