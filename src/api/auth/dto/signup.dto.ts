import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SignupRequestDto {
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]{5,20}$/)
  @ApiProperty()
  loginId: string;

  @IsNotEmpty()
  @Matches(/^.{10,20}$/)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @Matches(/^[가-힣a-zA-Z]{2,8}$/)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Matches(/^0\d{10}$/)
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  @ApiProperty()
  email: string;

  @IsOptional()
  @Matches(/^https:\/\/yoodongseon\.s3\.ap-northeast-2\.amazonaws\.com\/.+$/)
  @ApiProperty()
  profileImg?: string | null;

  @IsOptional()
  @IsString()
  @IsEnum(Provider)
  @ApiProperty()
  provider: Provider;
}

export class SignupResponseDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '생성된 유저 인덱스' })
  userIdx: number;
}
