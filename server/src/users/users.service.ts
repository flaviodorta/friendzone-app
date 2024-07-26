import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserNotExistsException } from 'src/errors/user-not-exists-exception';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return plainToInstance(User, users);
  }

  async findBy(options: FindOptionsWhere<User>): Promise<User[]> {
    const users = (await this.usersRepository.findBy(options)) as User[];

    if (users.length === 0) {
      throw new UserNotExistsException();
    }

    return users;
  }

  async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    const user = (await this.usersRepository.findBy(options))[0];

    if (!user) {
      throw new ConflictException('User not exists');
    }

    return user as User;
  }

  async create(newUser: CreateUserDto): Promise<User> {
    const emailExists = await this.emailExists(newUser.email);

    if (emailExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(newUser.password);

    newUser.password = hashedPassword;

    const savedUser = (await this.usersRepository.save(newUser)) as User;

    return savedUser;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async emailExists(email: string): Promise<boolean> {
    const emailExists = await this.usersRepository.findOne({
      where: { email },
    });

    if (emailExists) {
      return true;
    }

    return false;
  }

  // async addFriend(userId: number, friendId: number): Promise<User> {
  //   if (userId === friendId) {
  //     throw new ConflictException('Users cannot be friends with themselves');
  //   }

  //   const user = await this.usersRepository.findOne({
  //     where: { id: userId },
  //     relations: ['friends'],
  //   });

  //   if (!user) {
  //     throw new ConflictException(`User with ID ${userId} not found`);
  //   }

  //   const friend = await this.usersRepository.findOne({
  //     where: { id: friendId },
  //   });

  //   if (!friend) {
  //     throw new ConflictException(`Friend with ID ${friendId} not found`);
  //   }

  //   // Verifica se já são amigos
  //   if (user.friends.some((friend) => friend.id === friendId)) {
  //     throw new ConflictException('Users are already friends');
  //   }

  //   user.friends.push(friend);
  //   await this.usersRepository.save(user);

  //   return user;
  // }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    return isPasswordCorrect;
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }
}
