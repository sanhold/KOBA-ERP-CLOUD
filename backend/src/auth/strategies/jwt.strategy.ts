import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'koba_super_secret_access_token_key_2026',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.prisma.users.findFirst({
      where: {
        id: payload.sub,
        tenantId: payload.tenantId,
        deletedAt: null,
      },
    });

    if (!user || user.status === 'BLOCKED' || user.status === 'INACTIVE') {
      throw new UnauthorizedException('Utilisateur inactif, bloqué ou introuvable');
    }

    return payload;
  }
}
