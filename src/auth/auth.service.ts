import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(private userService: UserService) { }

	createUser(createUserDto: CreateUserDto){
		return this.userService.createUser(createUserDto)
	}

}
