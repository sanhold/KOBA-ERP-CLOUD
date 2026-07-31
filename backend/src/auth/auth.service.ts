import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 1. Inscription d'un nouvel utilisateur dans un Tenant
   */
  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, tenantId, companyId } = registerDto;

    // Vérifier l'existence du Tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant introuvable (ID: ${tenantId})`);
    }

    // Vérifier si l'utilisateur existe déjà dans ce Tenant
    const existingUser = await this.prisma.users.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException(`Un utilisateur avec l'email ${email} existe déjà dans ce Tenant`);
    }

    // Hachage du mot de passe avec bcrypt (salt cost 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const user = await this.prisma.users.create({
      data: {
        tenantId,
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        status: 'ACTIVE',
      },
    });

    // Logger l'activité d'inscription
    await this.prisma.activityLogs.create({
      data: {
        tenantId,
        userId: user.id,
        eventType: 'USER_REGISTERED',
        description: `Inscription initiale du compte ${email}`,
        ipAddress,
        userAgent,
      },
    });

    return this.generateAuthTokens(user, ipAddress, userAgent);
  }

  /**
   * 2. Connexion d'un utilisateur
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password, tenantId } = loginDto;

    // Récupérer l'utilisateur avec ses rôles
    const user = await this.prisma.users.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Identifiants incorrects ou compte introuvable');
    }

    if (user.status === 'BLOCKED' || user.status === 'INACTIVE') {
      throw new UnauthorizedException('Votre compte est inactif ou suspendu');
    }

    // Vérification du mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Logger la tentative échouée
      await this.prisma.activityLogs.create({
        data: {
          tenantId,
          userId: user.id,
          eventType: 'LOGIN_FAILED',
          description: `Tentative de connexion échouée (mot de passe invalide) pour ${email}`,
          ipAddress,
          userAgent,
        },
      });

      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Logger la connexion réussie
    await this.prisma.activityLogs.create({
      data: {
        tenantId,
        userId: user.id,
        eventType: 'LOGIN_SUCCESS',
        description: `Connexion réussie pour ${email}`,
        ipAddress,
        userAgent,
      },
    });

    return this.generateAuthTokens(user, ipAddress, userAgent);
  }

  /**
   * 3. Renouvellement de l'Access Token (Refresh Token Rotation)
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { tenantId, refreshToken } = refreshTokenDto;

    // Rechercher la session active
    const session = await this.prisma.sessions.findFirst({
      where: {
        tenantId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!session || !session.user || session.user.deletedAt) {
      throw new UnauthorizedException('Session expirée ou invalide');
    }

    // Vérifier la validité du Refresh Token
    const isTokenValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!isTokenValid) {
      // Révocation préventive en cas de tentative de réutilisation suspecte
      await this.prisma.sessions.deleteMany({
        where: { userId: session.userId },
      });
      throw new UnauthorizedException('Refresh Token révoqué (détection de réutilisation)');
    }

    // Supprimer l'ancienne session (Token Rotation)
    await this.prisma.sessions.delete({
      where: { id: session.id },
    });

    return this.generateAuthTokens(session.user, ipAddress, userAgent);
  }

  /**
   * 4. Déconnexion de l'utilisateur
   */
  async logout(userId: string, tenantId: string, ipAddress?: string, userAgent?: string): Promise<{ message: string }> {
    // Invalider toutes les sessions actives de l'utilisateur
    await this.prisma.sessions.deleteMany({
      where: {
        userId,
        tenantId,
      },
    });

    // Logger la déconnexion
    await this.prisma.activityLogs.create({
      data: {
        tenantId,
        userId,
        eventType: 'LOGOUT',
        description: `Déconnexion de l'utilisateur`,
        ipAddress,
        userAgent,
      },
    });

    return { message: 'Déconnexion réussie et session révoquée avec succès' };
  }

  /**
   * 5. Changement de mot de passe (Utilisateur connecté)
   */
  async changePassword(userId: string, tenantId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.users.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Le mot de passe actuel est incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.users.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalider les anciennes sessions pour forcer la réauthentification
    await this.prisma.sessions.deleteMany({
      where: { userId },
    });

    return { message: 'Mot de passe modifié avec succès. Veuillez vous réauthentifier.' };
  }

  /**
   * 6. Demande de réinitialisation de mot de passe
   */
  async resetPasswordRequest(dto: ResetPasswordRequestDto): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({
      where: {
        tenantId_email: {
          tenantId: dto.tenantId,
          email: dto.email,
        },
      },
    });

    if (user && !user.deletedAt) {
      // Logger la demande
      await this.prisma.activityLogs.create({
        data: {
          tenantId: dto.tenantId,
          userId: user.id,
          eventType: 'PASSWORD_RESET_REQUESTED',
          description: `Demande de réinitialisation de mot de passe envoyée à ${dto.email}`,
        },
      });
    }

    return { message: 'Si l’adresse email existe, des instructions de réinitialisation ont été envoyées.' };
  }

  /**
   * 7. Récupération du profil de l'utilisateur connecté
   */
  async getProfile(userId: string, tenantId: string) {
    const user = await this.prisma.users.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
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
        isMfaEnabled: true,
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
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Profil utilisateur introuvable');
    }

    return user;
  }

  /**
   * Méthode utilitaire interne pour générer Access Token et Refresh Token
   */
  private async generateAuthTokens(user: any, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const roleCodes = user.userRoles ? user.userRoles.map((ur: any) => ur.role.code) : [];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      organizationId: user.organizationId || undefined,
      departmentId: user.departmentId || undefined,
      roles: roleCodes,
    };

    const accessToken = this.jwtService.sign(payload);

    // Génération d'un Refresh Token aléatoire
    const rawRefreshToken = this.jwtService.sign(
      { sub: user.id, tenantId: user.tenantId, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'koba_super_secret_refresh_token_key_2026',
        expiresIn: '7d',
      },
    );

    const refreshTokenHash = await bcrypt.hash(rawRefreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Enregistrer la session dans la BDD
    await this.prisma.sessions.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        refreshTokenHash,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: '15m',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        status: user.status,
        roles: roleCodes,
      },
    };
  }
}
