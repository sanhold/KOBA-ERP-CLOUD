import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * 1. Créer un rôle (Système ou Personnalisé Tenant / Company)
   */
  async create(dto: CreateRoleDto, userId?: string) {
    const existing = await this.prisma.roles.findUnique({
      where: {
        tenantId_code: {
          tenantId: dto.tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Le rôle avec le code '${dto.code}' existe déjà dans ce Tenant`);
    }

    const role = await this.prisma.roles.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        description: dto.description,
        isSystem: false,
      },
    });

    // Traçabilité Audit
    await this.auditService.logAction({
      tenantId: dto.tenantId,
      userId,
      action: AuditAction.CREATE,
      tableName: 'roles',
      recordId: role.id,
      newValues: { name: role.name, code: role.code, description: role.description },
    });

    return role;
  }

  /**
   * 2. Lister tous les rôles du Tenant (y compris les rôles système)
   */
  async findAllByTenant(tenantId: string) {
    return this.prisma.roles.findMany({
      where: {
        OR: [{ tenantId }, { isSystem: true }],
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  /**
   * 3. Obtenir les détails d'un rôle
   */
  async findOne(id: string, tenantId: string) {
    const role = await this.prisma.roles.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { isSystem: true }],
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Rôle introuvable (ID: ${id})`);
    }

    return role;
  }

  /**
   * 4. Mettre à jour un rôle
   */
  async update(id: string, tenantId: string, dto: UpdateRoleDto, userId?: string) {
    const role = await this.findOne(id, tenantId);

    if (role.isSystem) {
      throw new ForbiddenException('Les rôles système ne peuvent pas être modifiés');
    }

    const updated = await this.prisma.roles.update({
      where: { id },
      data: dto,
    });

    // Traçabilité Audit
    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'roles',
      recordId: role.id,
      oldValues: { name: role.name, description: role.description },
      newValues: { name: updated.name, description: updated.description },
    });

    return updated;
  }

  /**
   * 5. Affecter des permissions granulaires à un rôle (RolePermission N:N)
   */
  async assignPermissions(roleId: string, tenantId: string, dto: AssignPermissionsDto, userId?: string) {
    const role = await this.findOne(roleId, tenantId);

    if (role.isSystem && role.code === 'SUPER_ADMIN') {
      throw new ForbiddenException('Les permissions du rôle SUPER_ADMIN sont immuables');
    }

    // Récupérer les anciennes permissions pour l'audit
    const oldPermissions = role.rolePermissions.map((rp) => rp.permission.code);

    // Supprimer les anciennes associations
    await this.prisma.rolePermissions.deleteMany({
      where: { roleId: role.id },
    });

    // Créer les nouvelles associations N-N
    const dataToInsert = dto.permissionIds.map((permissionId) => ({
      roleId: role.id,
      permissionId,
    }));

    await this.prisma.rolePermissions.createMany({
      data: dataToInsert,
    });

    const updatedRole = await this.findOne(roleId, tenantId);
    const newPermissions = updatedRole.rolePermissions.map((rp) => rp.permission.code);

    // Traçabilité Audit des changements de permissions
    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'role_permissions',
      recordId: role.id,
      oldValues: { permissions: oldPermissions },
      newValues: { permissions: newPermissions },
    });

    return updatedRole;
  }

  /**
   * 6. Suppression logique d'un rôle
   */
  async softDelete(id: string, tenantId: string, userId?: string) {
    const role = await this.findOne(id, tenantId);

    if (role.isSystem) {
      throw new ForbiddenException('Les rôles système ne peuvent pas être supprimés');
    }

    const deleted = await this.prisma.roles.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Traçabilité Audit
    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.DELETE,
      tableName: 'roles',
      recordId: role.id,
      oldValues: { code: role.code },
    });

    return deleted;
  }
}
