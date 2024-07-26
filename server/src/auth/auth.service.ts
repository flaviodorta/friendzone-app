import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignAccessTokenDto } from './dtos/sign-access-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserNotExistsException } from 'src/errors/user-not-exists-exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyAccessToken(dto: { access_token }): Promise<boolean> {
    let isValidToken: any;
    try {
      isValidToken = await this.jwtService.verifyAsync(dto.access_token, {
        secret: 'secret',
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!isValidToken) throw new UnauthorizedException('Invalid JWT');

    console.log('email: ', isValidToken.email);

    const user = await this.userService.findOneBy({
      email: isValidToken.email,
    });

    if (!user) {
      throw new UserNotExistsException();
    }

    return true;
  }

  async signUp(dto: SignUpDto): Promise<any> {
    const { email, password, name } = dto;

    const user = await this.userService.create({ email, name, password });

    const { id } = user;

    delete user.password;

    return { access_token: await this.signAccessToken({ id, email }) };
  }

  async signIn(dto: SignInDto): Promise<any> {
    const { email, password } = dto;

    const user = await this.userService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('User not exists');
    }

    const { id } = user;

    if (!this.userService.comparePassword(password, user.password)) {
      throw new UnauthorizedException('Incorrect password');
    }

    delete user.password;

    return {
      access_token: await this.signAccessToken({ id, email }),
      user,
    };
  }

  async signAccessToken(dto: SignAccessTokenDto): Promise<string> {
    const payload = { sub: dto.id, email: dto.email };

    return await this.jwtService.signAsync(payload);
  }
}
