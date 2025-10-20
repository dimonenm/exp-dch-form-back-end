import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig, getJwtSecret } from './constants'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: getJwtConfig,
      signOptions: { expiresIn: '120s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
