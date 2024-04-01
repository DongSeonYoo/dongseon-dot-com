import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignupRequestDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entitites/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(signupDto: SignupRequestDto): Promise<User['idx']> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    if (await this.checkDuplicateEmail(signupDto.email)) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    if (await this.checkDuplicateLoginId(signupDto.loginId)) {
      throw new ConflictException('이미 사용 중인 아이디입니다.');
    }

    const createUserResult = await this.prismaService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
        provider: signupDto.provider,
      },
      select: {
        idx: true,
      },
    });

    return createUserResult.idx;
  }

  private async checkDuplicateEmail(email: string): Promise<boolean> {
    const checkDuplicateEmail = await this.prismaService.user.findFirst({
      select: {
        idx: true,
      },
      where: {
        email,
        deletedAt: null,
      },
    });

    return !!checkDuplicateEmail;
  }

  private async checkDuplicateLoginId(loginId: string): Promise<boolean> {
    const checkDuplicateLoginId = await this.prismaService.user.findFirst({
      select: {
        idx: true,
      },
      where: {
        loginId,
        deletedAt: null,
      },
    });

    return !!checkDuplicateLoginId;
  }
}
