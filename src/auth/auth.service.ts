import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { UpdateUserDto } from 'src/user/dto/updateUser.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(private userService: UserService) { }

	createUser(createUserDto: CreateUserDto): Promise<User | null>{
		return this.userService.createUser(createUserDto)
	}

	getAllUsers(): Promise<User[] | null>{
		return this.userService.findAllUsers()
	}

	getUserById(id: string): Promise<User | null>{
		return this.userService.findById(id)
	}

	getUserByLogin(login: string): Promise<User | null>{
		return this.userService.findUserByLogin(login)
	}

	updateUser(updateUserDto: UpdateUserDto): Promise<User | null>{
		return this.userService.updateUser(updateUserDto)
	}

	deleteUser(id: string): Promise<string>{
		return this.userService.deleteUser(id)
	}

}
