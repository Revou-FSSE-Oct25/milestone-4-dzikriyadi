import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // CREATE USER (dipakai juga oleh admin / register nanti)
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password, // ⚠️ nanti di-hash di auth service
      role: createUserDto.role,
    });
  }

  // GET ALL USERS (admin)
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // GET USER BY ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // UPDATE USER
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // pastikan user ada
    await this.findOne(id);

    return this.userRepository.update(id, {
      ...updateUserDto,
    });
  }

  // DELETE USER
  async remove(id: string): Promise<User> {
    // pastikan user ada
    await this.findOne(id);

    return this.userRepository.delete(id);
  }

  // GET PROFILE (requirement)
  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // UPDATE PROFILE (requirement)
  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.update(userId, updateUserDto);
  }
}
