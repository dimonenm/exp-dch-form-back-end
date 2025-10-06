import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/createUser.dto'
import { User } from 'generated/prisma'
import { hash } from 'argon2'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(userDto: CreateUserDto): Promise<User | null> {
    const isExist = await this.findUserByLogin(userDto.login);

    if (isExist) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким email уже существует.',
      );
    }

    const newUser: Pick<User, 'login' | 'passwordHash'> = {
      login: userDto.login,
      passwordHash: userDto.password ? await hash(userDto.password) : '',
    };

    return this.prisma.user.create({
      data: newUser,
    });
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    return user;
  }
}
