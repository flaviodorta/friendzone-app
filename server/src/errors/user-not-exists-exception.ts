import { BadRequestException } from '@nestjs/common';

export class UserNotExistsException extends BadRequestException {
  constructor() {
    super('User not exists');
  }
}
