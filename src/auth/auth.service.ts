import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'generated/prisma'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { UpdateUserDto } from 'src/user/dto/updateUser.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService) { }

	async signIn(login: string, password: string): Promise<{ access_token: string }> {

		const user = await this.userService.findUserByLogin(login)


		if (user?.passwordHash !== password) {
			throw new UnauthorizedException()
		}
		const payload = { id: user.id, login: user.login, role: user.role }
		return {
			access_token: await this.jwtService.signAsync(payload),
		}
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
