import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié');
    }

    // Récupérer toutes les permissions associées aux rôles de l'utilisateur
    const userWithPermissions = await this.prisma.users.findUnique({
      where: { id: user.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      throw new ForbiddenException('Utilisateur introuvable');
    }

    const userPermissionCodes = new Set<string>();

    for (const userRole of userWithPermissions.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        userPermissionCodes.add(rolePermission.permission.code);
      }
    }

    const hasAllPermissions = requiredPermissions.every((perm) => userPermissionCodes.has(perm));

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Permissions insuffisantes. Requis : [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
