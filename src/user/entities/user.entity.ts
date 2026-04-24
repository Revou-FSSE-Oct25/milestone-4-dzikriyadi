import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = partial.id;
    this.name = partial.name;
    this.email = partial.email;
    this.role = partial.role;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
