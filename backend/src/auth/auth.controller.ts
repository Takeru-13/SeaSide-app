import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }
  
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.service.register(dto);

    return user;
  }
} 