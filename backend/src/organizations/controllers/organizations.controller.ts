import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from '../services/organizations.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/guards/permissions.guard';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@ApiTags('Organisations & Holdings (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Permissions('USER.CREATE')
  @ApiOperation({ summary: 'Créer une nouvelle organisation / holding' })
  @ApiResponse({ status: 201, description: 'Organisation créée' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(user.tenantId, dto, user.sub);
  }

  @Get()
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Lister toutes les organisations du Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des organisations' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.organizationsService.findAllByTenant(user.tenantId);
  }

  @Get(':id')
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Détails d’une organisation par ID' })
  @ApiResponse({ status: 200, description: 'Détails de l’organisation' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Permissions('USER.UPDATE')
  @ApiOperation({ summary: 'Mettre à jour les informations d’une organisation' })
  @ApiResponse({ status: 200, description: 'Organisation mise à jour' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete(':id')
  @Permissions('USER.DELETE')
  @ApiOperation({ summary: 'Suppression logique d’une organisation' })
  @ApiResponse({ status: 200, description: 'Organisation supprimée' })
  softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.organizationsService.softDelete(id, user.tenantId, user.sub);
  }
}
