import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { User } from 'generated/prisma'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { UpdateUserDto } from 'src/user/dto/updateUser.dto'
import { UserService } from 'src/user/user.service'
import { SignInDto } from './dto/signIn.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) { }

	async signIn(req: Request, dto: SignInDto): Promise<void> {

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


		return
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
