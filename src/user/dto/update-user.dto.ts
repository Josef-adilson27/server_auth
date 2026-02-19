import { PartialType } from '@nestjs/mapped-types';
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsUrl,
  Matches
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { AuthMethod, UserRole } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(100, { message: 'Email не должен превышать 100 символов' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Пароль должен содержать как минимум 1 заглавную букву, 1 строчную букву и 1 цифру или спецсимвол',
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Некорректная роль пользователя' })
  role?: UserRole;
    
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  @MaxLength(30, { message: 'Имя не должно превышать 30 символов' })
  displayName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL для изображения' })
  @MaxLength(500, { message: 'URL изображения слишком длинный' })
  picture?: string;

  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;

  @IsOptional()
  @IsEnum(AuthMethod, { message: 'Некорректный метод аутентификации' })
  method?: AuthMethod;
}
