import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignInDto {
	@IsString({ message: 'login должен быть строкой.' })
	@IsNotEmpty({ message: 'login обязателен для заполнения.' })
	login!: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
	@MinLength(5, {
		message: 'Пароль должен содержать минимум 5 символов.'
	})
	password!: string
}
