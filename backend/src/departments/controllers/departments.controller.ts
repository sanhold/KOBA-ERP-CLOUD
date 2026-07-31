import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from '../services/departments.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/guards/permissions.guard';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@ApiTags('Départements & Services Interne (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Permissions('USER.CREATE')
  @ApiOperation({ summary: 'Créer un nouveau département / service interne' })
  @ApiResponse({ status: 201, description: 'Département créé' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(user.tenantId, dto, user.sub);
  }

  @Get()
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Lister et rechercher les départements du Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des départements' })
  findAll(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.departmentsService.findAllByTenant(user.tenantId, search);
  }

  @Get(':id')
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Détails d’un département par ID' })
  @ApiResponse({ status: 200, description: 'Détails du département' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Permissions('USER.UPDATE')
  @ApiOperation({ summary: 'Mettre à jour les informations d’un département' })
  @ApiResponse({ status: 200, description: 'Département mis à jour' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete(':id')
  @Permissions('USER.DELETE')
  @ApiOperation({ summary: 'Suppression logique d’un département' })
  @ApiResponse({ status: 200, description: 'Département supprimé' })
  softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.softDelete(id, user.tenantId, user.sub);
  }
}
