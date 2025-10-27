import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { jwtConstants } from '../../config/jwt.config'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    // const token = this.extractTokenFromHeader(request);
    const token = this.extractTokenFromCookies(request)

    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token)
      request['user'] = payload

      // const payload = await this.jwtService.verifyAsync(token, {
      //   secret: jwtConstants.secret,
      // });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

    } catch {
      const isExpire = await this.jwtService.decode(token)
      const isElapsedTime = (Number(new Date(isExpire.exp)) - (Number(new Date()) / 1000))
      if (isElapsedTime <= 0) {
        throw new UnauthorizedException({ errorMessage: 'Время жизни accessToken истекло' })
      }

      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const token = request.cookies.accessToken
    return token
  }
}
