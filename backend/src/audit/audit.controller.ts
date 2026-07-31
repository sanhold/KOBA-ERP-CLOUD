import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Audit & Traçabilité (KOBA CORE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @Permissions('system:audit:read')
  @ApiOperation({ summary: 'Consulter le registre immuable des Audit Logs' })
  @ApiResponse({ status: 200, description: 'Registre des Audit Logs' })
  findAll(@CurrentUser() user: JwtPayload, @Query() query: QueryAuditLogsDto) {
    return this.auditService.findAllByTenant(user.tenantId, query);
  }
}
