import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Utilisateurs (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('system:users:read')
  @ApiOperation({ summary: 'Lister tous les utilisateurs du Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.usersService.findAllByTenant(user.tenantId);
  }

  @Get(':id')
  @Permissions('system:users:read')
  @ApiOperation({ summary: 'Détails d’un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Permissions('system:users:update')
  @ApiOperation({ summary: 'Mise à jour des informations ou statut d’un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, user.tenantId, dto);
  }

  @Post(':id/roles')
  @Permissions('system:users:assign-role')
  @ApiOperation({ summary: 'Attribuer un rôle à un utilisateur' })
  @ApiResponse({ status: 200, description: 'Rôle attribué' })
  assignRole(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AssignRoleDto,
  ) {
    return this.usersService.assignRole(id, user.tenantId, dto);
  }

  @Delete(':id')
  @Permissions('system:users:delete')
  @ApiOperation({ summary: 'Suppression logique (Soft Delete) d’un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur désactivé' })
  softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.usersService.softDelete(id, user.tenantId);
  }
}
