import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByTenant(tenantId: string) {
    return this.prisma.users.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
            companyId: true,
            branchId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
        tenantId: true,
        organizationId: true,
        departmentId: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
            companyId: true,
            branchId: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur introuvable (ID: ${id})`);
    }

    return user;
  }

  async update(id: string, tenantId: string, dto: UpdateUserDto) {
    await this.findOne(id, tenantId);

    return this.prisma.users.update({
      where: { id },
      data: dto,
    });
  }

  async assignRole(userId: string, tenantId: string, dto: AssignRoleDto) {
    const user = await this.findOne(userId, tenantId);

    return this.prisma.userRoles.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: dto.roleId,
        },
      },
      create: {
        userId: user.id,
        roleId: dto.roleId,
        companyId: dto.companyId,
        branchId: dto.branchId,
      },
      update: {
        companyId: dto.companyId,
        branchId: dto.branchId,
      },
    });
  }

  async softDelete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.users.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }
}
