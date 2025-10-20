import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConstants = {
  secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
}

export const getJwtConfig = (
  configService: ConfigService
): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET')
})

export const getJwtSecret = (configService: ConfigService): { secret: string } => {
  return configService.getOrThrow('JWT_SECRET')
}