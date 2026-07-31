import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BranchesService } from '../services/branches.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/guards/permissions.guard';
import { Permissions } from '../../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@ApiTags('Filiales & Agences (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Permissions('USER.CREATE')
  @ApiOperation({ summary: 'Créer une nouvelle filiale / agence' })
  @ApiResponse({ status: 201, description: 'Filiale créée' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBranchDto) {
    return this.branchesService.create(user.tenantId, dto, user.sub);
  }

  @Get()
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Lister et rechercher les agences du Tenant' })
  @ApiResponse({ status: 200, description: 'Liste des agences' })
  findAll(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.branchesService.findAllByTenant(user.tenantId, search);
  }

  @Get(':id')
  @Permissions('USER.READ')
  @ApiOperation({ summary: 'Détails d’une agence par ID' })
  @ApiResponse({ status: 200, description: 'Détails de l’agence' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.branchesService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Permissions('USER.UPDATE')
  @ApiOperation({ summary: 'Mettre à jour les informations d’une agence' })
  @ApiResponse({ status: 200, description: 'Agence mise à jour' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchesService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete(':id')
  @Permissions('USER.DELETE')
  @ApiOperation({ summary: 'Suppression logique d’une agence' })
  @ApiResponse({ status: 200, description: 'Agence supprimée' })
  softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.branchesService.softDelete(id, user.tenantId, user.sub);
  }
}
