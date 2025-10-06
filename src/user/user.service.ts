import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) { }

		async createUser(userDto: CreateUserDto): Promise<User | null> {

		const isExist = await this.findByEmail(userDto.email)

		if (isExist) {
			throw new ConflictException('Регистрация не удалась. Пользователь с таким email уже существует.')
		}

		const newUser = {
			email: userDto.email,
			name: userDto.name ? userDto.name : '',
			password: userDto.password ? await hash(userDto.password) : ''
		}

		return this.prisma.user.create(
			{
				data: newUser
			}
		)
	}
}
