import { Injectable, NotFoundException } from '@nestjs/common';
import { MyLogger } from '../logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly logger: MyLogger, private readonly databaseService: DatabaseService) {
    this.logger.setContext(UsersService.name)
  }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createUserDto
    })
  }

  async findAll() {
    this.logger.log('service here')
    return this.databaseService.user.findMany({
      where: {}
    })
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      }
    })
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto
    })
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      }
    })
  }
}
