import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: {
    tenantId: string;
    companyId?: string;
    userId?: string;
    action: AuditAction;
    tableName: string;
    recordId: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
  }) {
    return this.prisma.auditLogs.create({
      data: {
        tenantId: params.tenantId,
        companyId: params.companyId,
        userId: params.userId,
        action: params.action,
        tableName: params.tableName,
        recordId: params.recordId,
        oldValues: params.oldValues || undefined,
        newValues: params.newValues || undefined,
        ipAddress: params.ipAddress,
      },
    });
  }

  async findAllByTenant(tenantId: string, query: QueryAuditLogsDto) {
    const whereClause: any = { tenantId };

    if (query.tableName) {
      whereClause.tableName = query.tableName;
    }
    if (query.action) {
      whereClause.action = query.action as AuditAction;
    }

    return this.prisma.auditLogs.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
