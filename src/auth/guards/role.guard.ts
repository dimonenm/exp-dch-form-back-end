
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../constants'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('RoleGuard: ');
    const request = context.switchToHttp().getRequest()
    const { user } = context.switchToHttp().getRequest();
    console.log('user: ', user);



    if (!request) {
      throw new UnauthorizedException()
    }

    try {
      console.log('request.user: ', request.user)
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }
}
