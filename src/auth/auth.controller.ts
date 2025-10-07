import { Body, ConflictException, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { User } from 'generated/prisma'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@HttpCode(HttpStatus.OK)
	@Post('create_user')
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		const user = await this.authService.createUser(createUserDto)
		if (!user) {
			console.log('user: ', user);
			throw new ConflictException(
				'Регистрация не удалась.'
			)
		}
		return user
	}
}
