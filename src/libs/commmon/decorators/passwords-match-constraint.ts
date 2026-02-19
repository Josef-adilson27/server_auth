import { 
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';


@ValidatorConstraint({ name: 'passwordsMatch', async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(repeatPassword: string, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    return object.password === repeatPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Пароли не совпадают';
  }
}