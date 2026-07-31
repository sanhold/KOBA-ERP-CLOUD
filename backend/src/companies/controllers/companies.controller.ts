import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from '../services/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/guards/permissions.guard';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@ApiTags('Entreprises & Sociétés Légales (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Permissions('USER.CREATE')
  @ApiOperation({ summary: 'Créer une nouvelle entreprise / société juridique' })
  @ApiResponse({ status: 201, description: 'Entreprise créée' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(user.tenantId, dto, user.sub);
  }

  @Get()
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Lister toutes les entreprises du Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des entreprises' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.companiesService.findAllByTenant(user.tenantId);
  }

  @Get(':id')
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Détails d’une entreprise par ID' })
  @ApiResponse({ status: 200, description: 'Détails de l’entreprise' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.companiesService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Permissions('USER.UPDATE')
  @ApiOperation({ summary: 'Mettre à jour les informations d’une entreprise' })
  @ApiResponse({ status: 200, description: 'Entreprise mise à jour' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete(':id')
  @Permissions('USER.DELETE')
  @ApiOperation({ summary: 'Suppression logique d’une entreprise' })
  @ApiResponse({ status: 200, description: 'Entreprise supprimée' })
  softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.companiesService.softDelete(id, user.tenantId, user.sub);
  }
}
