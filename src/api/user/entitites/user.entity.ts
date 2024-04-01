import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  idx: number;

  @ApiProperty()
  loginId: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profileImg: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
