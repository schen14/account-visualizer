import { Injectable, NotFoundException } from '@nestjs/common';
import { MyLogger } from 'src/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly logger: MyLogger) {
    this.logger.setContext(UsersService.name)
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    this.logger.log('service here')
    //return `This action returns all users`;
    throw new NotFoundException('user not found')
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
