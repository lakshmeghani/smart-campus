import { ExecutionContext, CanActivate } from '@nestjs/common'
import { Observable } from 'rxjs'

export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userData;
  }
}

