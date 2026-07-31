import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';

@ApiTags('Tenants (KOBA CORE Super-Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Permissions('system:tenants:create')
  @ApiOperation({ summary: 'Provisionner un nouveau Tenant SaaS' })
  @ApiResponse({ status: 201, description: 'Tenant créé' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get()
  @Permissions('system:tenants:read')
  @ApiOperation({ summary: 'Lister tous les Tenants de la plateforme' })
  @ApiResponse({ status: 200, description: 'Liste des Tenants' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Permissions('system:tenants:read')
  @ApiOperation({ summary: 'Détails d’un Tenant par ID' })
  @ApiResponse({ status: 200, description: 'Détails du Tenant' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }
}
