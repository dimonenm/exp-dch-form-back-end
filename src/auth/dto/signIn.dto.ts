import { IsString, Min } from 'class-validator'

export class SignInDto {
	@IsString()
	login!: string

	@IsString()
	@Min(6)
	password!: string
}