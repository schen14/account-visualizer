import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AccountsService {
  // Could be useful for adding the first records for each new imported account
  // https://www.youtube.com/watch?v=-MlXwb42nKo

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(userId: number) {
    return this.databaseService.account.findMany({
      where: {
        userId,
      }
    });
  }

  async findOne(userId: number, accountId: number) {
    return this.databaseService.account.findFirst({
      where: {
        id: accountId,
        userId,
      }
    });
  }
  
  async create(userId: number, createAccountDto: CreateAccountDto) {
    return this.databaseService.account.create({
      data: { userId, ...createAccountDto }
    })
  }

  async update(userId: number, accountId: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.databaseService.account.findUnique({
      where: {
        id: accountId,
        userId,
      }
    })

    if (!account) {
      throw new NotFoundException('Resource not found');
    }

    return this.databaseService.account.update({
      where: {
        id: accountId
      },
      data: {
        ...updateAccountDto
      }
    });

  }

  async remove(userId: number, accountId: number) {
    const account = await this.databaseService.account.findUnique({
      where: {
        id: accountId,
        userId,
      }
    })

    if (!account) {
      throw new NotFoundException('Resource not found');
    }

    await this.databaseService.account.delete({
      where: {
        id: accountId
      }
    });
  }
}
