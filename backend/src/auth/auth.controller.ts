import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentification & Sessions (KOBA CORE)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription d’un utilisateur dans un Tenant' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(registerDto, ipAddress, userAgent);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur et émission des tokens JWT' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Renouvellement de l’Access Token via Refresh Token' })
  @ApiResponse({ status: 200, description: 'Token renouvelé avec succès' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(refreshTokenDto, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion et invalidation de la session' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout(@CurrentUser() user: JwtPayload, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.logout(user.sub, user.tenantId, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @ApiOperation({ summary: 'Changement du mot de passe de l’utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié' })
  async changePassword(@CurrentUser() user: JwtPayload, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.sub, user.tenantId, dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password-request')
  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  @ApiResponse({ status: 200, description: 'Instruction envoyée si compte existant' })
  async resetPasswordRequest(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Récupération du profil de l’utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub, user.tenantId);
  }
}
