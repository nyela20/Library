import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {   // 👈 doit être exactement "export class RolesGuard"
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new ForbiddenException('Token manquant');

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      if (!roles.includes(decoded.role)) {
        throw new ForbiddenException('Accès interdit : rôle insuffisant');
      }
      request.user = decoded;
      return true;
    } catch {
      throw new ForbiddenException('Token invalide ou expiré');
    }
  }
}
