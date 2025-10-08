import { Body, ConflictException, NotFoundException, Controller, Get, HttpCode, HttpStatus, Post, Put, Delete, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { User } from 'generated/prisma'
import { UpdateUserDto } from 'src/user/dto/updateUser.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@HttpCode(HttpStatus.OK)
	@Post('create_user')
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		const user = await this.authService.createUser(createUserDto)
		if (!user) {
			throw new ConflictException(
				'Регистрация не удалась.'
			)
		}
		return user
	}

	@HttpCode(HttpStatus.OK)
	@Get('get_all_users')
	async getAllUsers(): Promise<User[]> {
		const users = await this.authService.getAllUsers()

		if (users === null) {
			throw new ConflictException(
				'База данных пользователей не обнаружена.'
			)
		}
		if (users.length <= 0) {
			throw new NotFoundException(
				'Пользователи в базе данных не обнаружены.'
			)
		}

		return users
	}

	@HttpCode(HttpStatus.OK)
	@Get('get_user_by_id')
	async getUserById(@Query('id') id: string): Promise<User> {
		console.log('id: ', id)
		const user = await this.authService.getUserById(id)

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден.'
			)
		}

		return user
	}

	@HttpCode(HttpStatus.OK)
	@Get('get_user_by_login')
	async getUserByLogin(@Query('login') login: string): Promise<User> {
		const user = await this.authService.getUserByLogin(login)

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден.'
			)
		}

		return user
	}

	@HttpCode(HttpStatus.OK)
	@Put('update_user')
	async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.authService.updateUser(updateUserDto)
		if (!user) {
			throw new ConflictException(
				'Обновление пользователя не удалось.'
			)
		}
		return user
	}

	@HttpCode(HttpStatus.OK)
	@Delete('delete_user')
	async deleteUser(@Query('id') id: string): Promise<string> {
		const isDeleted = await this.authService.deleteUser(id)
		if (!isDeleted) {
			throw new ConflictException(
				'Удаление пользователя не удалось.'
			)
		}
		return isDeleted
	}
}
