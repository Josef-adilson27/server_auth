import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthMethod, User, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  
  async register(req: Request, registerDto: RegisterDto) {
    const existingUser = await this.userService.findEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email уже существует. Войдите или используйте другой email.',
      );
    }

    const hashedPassword = await hash(registerDto.password);

    const newUser = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      displayName: registerDto.displayName,
      method: AuthMethod.CREDENTIALS,
      isVerified: false,
    });
    return this.saveSession(req, newUser);
  }

  async login(req: Request, loginDto: LoginDto) {
    const logedUser = await this.userService.findEmail(loginDto.email);

    if (!logedUser) {
      throw new NotFoundException('Пользователь не найден. Проверьте данные.');
    }

    const isPasswordValid = await verify(logedUser.password, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Неверный пароль. Попробуйте еще раз или восстановите пароль если забыли его.',
      );
    }

    return this.saveSession(req, logedUser);
  }

  async logout(req: Request, res: Response) {
    return await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Проблема с сервером или сессия была уже завершена. Попробуйе позже.',
            ),
          );
        } else resolve();
      });
      res.clearCookie(this.configService.getOrThrow('SESSION_NAME'));
      resolve();
    });
  }

  private async saveSession(req: Request, user: User) {
    req.session.userId = user.id;

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Проблема с сервером или сессия была уже завершена. Попробуйе позже.',
            ),
          );
        } else resolve();
      });
    });
    return { user };
  }
}
