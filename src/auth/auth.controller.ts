import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import express from 'express';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Req() req: express.Request,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(req, registerDto);
  }
  @Post('login')
    async login(
    @Req() req: express.Request,
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(req,  loginDto);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: express.Request, @Res({passthrough:true}) res: express.Response) {
    return this.authService.logout(req, res);
  }
}
