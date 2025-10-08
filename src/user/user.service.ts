import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from 'generated/prisma';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    if (!createUserDto.login) {
      throw new ConflictException('Регистрация не удалась. Отсутствует login.');
    }
    if (!createUserDto.password) {
      throw new ConflictException(
        'Регистрация не удалась. Отсутствует password.',
      );
    }
    if (!createUserDto.role) {
      throw new ConflictException('Регистрация не удалась. Отсутствует role.');
    }

    const isExist = await this.findUserByLogin(createUserDto.login);

    if (isExist) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким login уже существует.',
      );
    }

    const newUser: Pick<User, 'login' | 'passwordHash' | 'role'> = {
      login: createUserDto.login,
      passwordHash: await hash(createUserDto.password),
      role: createUserDto.role,
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

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findAllUsers(): Promise<User[] | null> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findUserByLogin(updateUserDto.login);

    if (!user) {
      throw new NotFoundException('Пользователь с таким login не существует.');
    } else {
      const newUser: User = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        login: updateUserDto.login ? updateUserDto.login : user.login,
        passwordHash: updateUserDto.password
          ? await hash(updateUserDto.password)
          : user.passwordHash,
        role: updateUserDto.role ? updateUserDto.role : user.role,
      };

      return this.prisma.user.update({
        where: { login: updateUserDto.login },
        data: newUser,
      });
    }
  }

  async deleteUser(id: string): Promise<string> {
    const isExist = await this.findById(id);

    if (!isExist) {
      throw new NotFoundException('Пользователь с таким id не существует.');
    } else {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      if (user) return `Пользователь с идентификатором ${user.id} удален.`;

      return `Удалить пользователя с идентификатором ${id} не удалось.`;
    }
  }
}
