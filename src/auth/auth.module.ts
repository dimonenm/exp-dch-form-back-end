import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from 'src/user/user.module'
import { getJwtConfig } from '../config/jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    UserModule,
    // JwtModule.register({
    //   global: true,
    //   secret: getJwtSecret,
    //   signOptions: { expiresIn: '120s' },
    // }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
