import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';
import { ResponseEntity } from 'src/common/util/common-response.util';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignupRequestDto })
  @ApiResponse({ type: SignupResponseDto })
  async signup(@Body() signupDto: SignupRequestDto) {
    const signupUserIdx = await this.authService.signup(signupDto);

    return ResponseEntity.SUCCESS_WITH({
      userIdx: signupUserIdx,
    });
  }
}
