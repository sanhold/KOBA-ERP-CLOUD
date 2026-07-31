import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Rôles (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('system:roles:create')
  @ApiOperation({ summary: 'Créer un nouveau rôle au niveau du Tenant' })
  @ApiResponse({ status: 201, description: 'Rôle créé' })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  @Permissions('system:roles:read')
  @ApiOperation({ summary: 'Lister tous les rôles d’un Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des rôles' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.rolesService.findAllByTenant(user.tenantId);
  }

  @Get(':id')
  @Permissions('system:roles:read')
  @ApiOperation({ summary: 'Détails d’un rôle par ID' })
  @ApiResponse({ status: 200, description: 'Détails du rôle' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.rolesService.findOne(id, user.tenantId);
  }

  @Post(':id/permissions')
  @Permissions('system:roles:assign-permissions')
  @ApiOperation({ summary: 'Affecter des permissions à un rôle' })
  @ApiResponse({ status: 200, description: 'Permissions réaffectées' })
  assignPermissions(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, user.tenantId, dto);
  }
}
