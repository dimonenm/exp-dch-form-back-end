import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { User } from 'generated/prisma'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { UpdateUserDto } from 'src/user/dto/updateUser.dto'
import { UserService } from 'src/user/user.service'
import { SignInDto } from './dto/signIn.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	ACCESS_TOKEN_NAME = 'accessToken'

	constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) { }

	async signIn(res: Response, dto: SignInDto): Promise<string> {

		const user = await this.userService.findUserByLogin(dto.login)

		if (!user || !user.passwordHash) {
			throw new NotFoundException("Пользователь не найден. Проверте введеные данные.")
		}

		const isValidPassword = await verify(user.passwordHash, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException("Неверный пароль")
		}

		const payload = { id: user?.id, login: user?.login, role: user?.role }
		const access_token = await this.jwtService.signAsync(payload)

		return access_token
	}

	logout(res: Response): string {

		// res.cookie(this.ACCESS_TOKEN_NAME, '', {
		// 	httpOnly: true,
		// 	domain: 'localhost',
		// 	expires: new Date(0),
		// 	secure: true,
		// 	sameSite: 'none'
		// })

		return 'Осуществлен выход'
	}

	createUser(createUserDto: CreateUserDto): Promise<User | null> {
		return this.userService.createUser(createUserDto)
	}

	getAllUsers(): Promise<User[] | null> {
		return this.userService.findAllUsers()
	}

	getUserById(id: string): Promise<User | null> {
		return this.userService.findById(id)
	}

	getUserByLogin(login: string): Promise<User | null> {
		return this.userService.findUserByLogin(login)
	}

	updateUser(updateUserDto: UpdateUserDto): Promise<User | null> {
		return this.userService.updateUser(updateUserDto)
	}

	deleteUser(id: string): Promise<string> {
		return this.userService.deleteUser(id)
	}

}
