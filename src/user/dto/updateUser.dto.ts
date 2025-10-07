import { IsString, Min } from 'class-validator'
import { Roles } from '../../../generated/prisma'

export class UpdateUserDto {
	@IsString()
	login!: string

	@IsString()
	@Min(6)
	password?: string

	@IsString()
	role?: Roles
}