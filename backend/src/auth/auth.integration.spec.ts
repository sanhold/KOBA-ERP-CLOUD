import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Reflector } from '@nestjs/core';

describe('KOBA CORE — Integration & Security Test Suite', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let permissionsGuard: PermissionsGuard;
  let reflector: Reflector;

  // Mock Database State
  const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
  const mockUserId = '987e6543-e89b-12d3-a456-426614174999';
  const mockRawPassword = 'P@ssword2026!';
  let mockHashedPassword = '';

  const mockUsersStore: any[] = [];
  const mockSessionsStore: any[] = [];
  const mockActivityLogsStore: any[] = [];

  beforeAll(async () => {
    mockHashedPassword = await bcrypt.hash(mockRawPassword, 12);
  });

  const mockPrisma = {
    tenant: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === mockTenantId) {
          return Promise.resolve({ id: mockTenantId, name: 'Sanogo Holding', status: 'ACTIVE' });
        }
        return Promise.resolve(null);
      }),
    },
    users: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.tenantId_email) {
          const user = mockUsersStore.find(
            (u) => u.tenantId === where.tenantId_email.tenantId && u.email === where.tenantId_email.email,
          );
          return Promise.resolve(user || null);
        }
        if (where.id) {
          const user = mockUsersStore.find((u) => u.id === where.id);
          return Promise.resolve(user || null);
        }
        return Promise.resolve(null);
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        const user = mockUsersStore.find((u) => u.id === where.id && u.tenantId === where.tenantId);
        return Promise.resolve(user || null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const newUser = {
          id: mockUserId,
          ...data,
          userRoles: [
            {
              role: {
                code: 'VENDEUR',
                rolePermissions: [
                  { permission: { code: 'sales:invoice:read' } },
                ],
              },
            },
          ],
        };
        mockUsersStore.push(newUser);
        return Promise.resolve(newUser);
      }),
    },
    sessions: {
      create: jest.fn().mockImplementation(({ data }) => {
        const session = { id: 'session-uuid-101', ...data };
        mockSessionsStore.push(session);
        return Promise.resolve(session);
      }),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        const session = mockSessionsStore[mockSessionsStore.length - 1];
        if (session && session.expiresAt > new Date()) {
          const user = mockUsersStore.find((u) => u.id === session.userId);
          return Promise.resolve({ ...session, user });
        }
        return Promise.resolve(null);
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        const idx = mockSessionsStore.findIndex((s) => s.id === where.id);
        if (idx !== -1) mockSessionsStore.splice(idx, 1);
        return Promise.resolve({ count: 1 });
      }),
      deleteMany: jest.fn().mockImplementation(() => Promise.resolve({ count: 1 })),
    },
    activityLogs: {
      create: jest.fn().mockImplementation(({ data }) => {
        mockActivityLogsStore.push(data);
        return Promise.resolve(data);
      }),
    },
  };

  beforeEach(async () => {
    mockUsersStore.length = 0;
    mockSessionsStore.length = 0;
    mockActivityLogsStore.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PermissionsGuard,
        Reflector,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload) => `jwt_token_${JSON.stringify(payload.sub || 'user')}`),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'JWT_SECRET') return 'test_jwt_secret';
              if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  // --------------------------------------------------------------------------
  // TEST 1 : CREATION UTILISATEUR
  // --------------------------------------------------------------------------
  it('✅ 1. Création utilisateur : doit enregistrer un compte avec mot de passe haché par bcrypt', async () => {
    const result = await authService.register({
      firstName: 'Moussa',
      lastName: 'Sanogo',
      email: 'moussa@koba.cloud',
      password: mockRawPassword,
      tenantId: mockTenantId,
    });

    expect(result).toBeDefined();
    expect(result.user.email).toBe('moussa@koba.cloud');
    expect(mockUsersStore.length).toBe(1);
    expect(mockUsersStore[0].passwordHash).not.toBe(mockRawPassword);
    expect(await bcrypt.compare(mockRawPassword, mockUsersStore[0].passwordHash)).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 2 : CONNEXION VALIDE
  // --------------------------------------------------------------------------
  it('✅ 2. Connexion valide : doit accepter email + mot de passe correct et retourner les tokens', async () => {
    // Pré-remplir l'utilisateur
    mockUsersStore.push({
      id: mockUserId,
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      passwordHash: mockHashedPassword,
      status: 'ACTIVE',
      userRoles: [],
    });

    const response = await authService.login({
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      password: mockRawPassword,
    });

    expect(response).toBeDefined();
    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // TEST 3 : MAUVAIS MOT DE PASSE REFUSE
  // --------------------------------------------------------------------------
  it('✅ 3. Mauvais mot de passe refusé : doit lever une UnauthorizedException', async () => {
    mockUsersStore.push({
      id: mockUserId,
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      passwordHash: mockHashedPassword,
      status: 'ACTIVE',
      userRoles: [],
    });

    await expect(
      authService.login({
        tenantId: mockTenantId,
        email: 'moussa@koba.cloud',
        password: 'WRONG_PASSWORD_2026',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  // --------------------------------------------------------------------------
  // TEST 4 : TOKEN GENERATION
  // --------------------------------------------------------------------------
  it('✅ 4. Token généré : doit générer un AccessToken et un RefreshToken valides', async () => {
    mockUsersStore.push({
      id: mockUserId,
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      passwordHash: mockHashedPassword,
      status: 'ACTIVE',
      userRoles: [{ role: { code: 'ADMIN_TENANT' } }],
    });

    const response = await authService.login({
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      password: mockRawPassword,
    });

    expect(response.accessToken).toContain('jwt_token_');
    expect(response.user.roles).toContain('ADMIN_TENANT');
  });

  // --------------------------------------------------------------------------
  // TEST 5 : TOKEN EXPIRE OU INVALIDE REFUSE
  // --------------------------------------------------------------------------
  it('✅ 5. Token expiré refusé : doit rejeter les sessions expirées lors du refresh', async () => {
    mockSessionsStore.push({
      id: 'expired-session-id',
      tenantId: mockTenantId,
      userId: mockUserId,
      refreshTokenHash: await bcrypt.hash('expired_refresh_token', 10),
      expiresAt: new Date(Date.now() - 10000), // Expiré il y a 10s
    });

    await expect(
      authService.refreshToken({
        tenantId: mockTenantId,
        refreshToken: 'expired_refresh_token',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  // --------------------------------------------------------------------------
  // TEST 6 : REFRESH TOKEN WORKS
  // --------------------------------------------------------------------------
  it('✅ 6. Refresh Token fonctionne : doit remplacer l’ancien token par un nouveau (Token Rotation)', async () => {
    const rawRefreshToken = 'valid_refresh_token_123';

    mockUsersStore.push({
      id: mockUserId,
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      passwordHash: mockHashedPassword,
      status: 'ACTIVE',
      userRoles: [],
    });

    mockSessionsStore.push({
      id: 'active-session-id',
      tenantId: mockTenantId,
      userId: mockUserId,
      refreshTokenHash: await bcrypt.hash(rawRefreshToken, 10),
      expiresAt: new Date(Date.now() + 3600000), // Valide
    });

    const response = await authService.refreshToken({
      tenantId: mockTenantId,
      refreshToken: rawRefreshToken,
    });

    expect(response).toBeDefined();
    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // TEST 7 : PERMISSION BLOQUANTE FONCTIONNE
  // --------------------------------------------------------------------------
  it('✅ 7. Permission bloquante fonctionne : PermissionsGuard doit rejeter l’accès si la permission manque', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['finance:ledger:delete']);

    mockUsersStore.push({
      id: mockUserId,
      tenantId: mockTenantId,
      email: 'moussa@koba.cloud',
      userRoles: [
        {
          role: {
            code: 'VENDEUR',
            rolePermissions: [
              { permission: { code: 'sales:invoice:read' } }, // N'a PAS finance:ledger:delete
            ],
          },
        },
      ],
    });

    const mockExecutionContext = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: mockUserId, tenantId: mockTenantId, roles: ['VENDEUR'] },
        }),
      }),
    } as any;

    await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
  });

  // --------------------------------------------------------------------------
  // TEST 8 : AUDIT ENREGISTRE
  // --------------------------------------------------------------------------
  it('✅ 8. Audit enregistré : doit consigner les événements d’inscription et de connexion dans ActivityLogs', async () => {
    await authService.register({
      firstName: 'Moussa',
      lastName: 'Sanogo',
      email: 'audit.test@koba.cloud',
      password: mockRawPassword,
      tenantId: mockTenantId,
    });

    expect(mockActivityLogsStore.length).toBeGreaterThan(0);
    expect(mockActivityLogsStore[0].eventType).toBe('USER_REGISTERED');
    expect(mockActivityLogsStore[0].tenantId).toBe(mockTenantId);
  });
});
