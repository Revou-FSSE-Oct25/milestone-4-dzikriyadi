import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private async ensureUserExists(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private handlePrismaError(error: unknown): never {
    const prismaError = error as Prisma.PrismaClientKnownRequestError | undefined;

    if (prismaError?.code === 'P2002') {
      throw new ConflictException('Email is already registered');
    }

    throw error;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      });

      return new UserEntity(user);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.ensureUserExists(userId);
    return new UserEntity(user);
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    await this.ensureUserExists(userId);

    try {
      const user = await this.userRepository.update(userId, {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password
          ? await bcrypt.hash(updateUserDto.password, 10)
          : undefined,
      });

      return new UserEntity(user);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
