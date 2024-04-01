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

  @ApiProperty({ required: false })
  profileImg?: string;

  @ApiProperty({ required: false })
  provider?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
