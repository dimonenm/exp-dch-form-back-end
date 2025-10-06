import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/createUser.dto'
import { User } from 'generated/prisma'
import { hash } from 'argon2'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }

	async createUser(userDto: CreateUserDto): Promise<User | null> {

		const isExist = await this.findByLogin(userDto.login)

		if (isExist) {
			throw new ConflictException('Регистрация не удалась. Пользователь с таким email уже существует.')
		}

		const newUser: Omit<User, "id" & "createdAt" & "updatedAt">  = {
			login: userDto.login,
			passwordHash: userDto.password ? await hash(userDto.password) : ''
		}

		return this.prisma.user.create(
			{
				data: newUser
			}
		)
	}

	async findByLogin(login: string): Promise<User | null> {

		const user = await this.prisma.user.findUnique({
			where: { login }
		})

		return user

	}
}
