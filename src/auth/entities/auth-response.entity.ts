import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class AuthResponseEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  constructor(accessToken: string, user: UserEntity) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
