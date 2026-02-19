import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches,
  Validate,
  IsNotEmpty,
} from 'class-validator';
import { PasswordsMatchConstraint } from 'src/libs/commmon/decorators/passwords-match-constraint';


export class RegisterDto {
  @IsString({message: "Имя должно бть строкой"})
  @IsNotEmpty({message: "Имя обязательно для заполнения"})
  displayName: string;
 
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(255, { message: 'Email не должен превышать 255 символов' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Пароль должен содержать как минимум 1 заглавную букву, 1 строчную букву и 1 цифру или спецсимвол',
  })
  password: string;
  
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
  @Validate(PasswordsMatchConstraint, {
    message: 'Пароли не совпадают',
  })
  repeatPassword: string;
}