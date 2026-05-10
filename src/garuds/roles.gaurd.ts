import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { UserStatus } from 'src/users/enums/user-status.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.session.userData.role;
    const userStatus = request.session.userData.status;

    if ([Role.ADMIN, Role.ORGANIZER].includes(userRole) && userStatus !== UserStatus.ACTIVE) {
      return false;
    }
    return requiredRoles.includes(userRole);
  }
}

