import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from '../database/database.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccountsService {
  // Could be useful for adding the first records for each new imported account
  // https://www.youtube.com/watch?v=-MlXwb42nKo

  constructor(private readonly databaseService: DatabaseService, private readonly eventEmitter: EventEmitter2) {}

  async findAll(userId: number) {
    return this.databaseService.account.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
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
    const account = await this.databaseService.account.create({
      data: { userId, ...createAccountDto }
    })
    
    // emit event on successful create to record balance/amount
    this.eventEmitter.emit('account.balanceUpdated', { 
      accountId: account.id,
      balance: createAccountDto.balance,
    });
    console.log('account.balanceUpdated event emitted')

    return account;
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

    const updatedAccount = await this.databaseService.account.update({
      where: {
        id: accountId
      },
      data: {
        ...updateAccountDto
      }
    });

    // emit event on successful update to balance/amount
    if (updateAccountDto.hasOwnProperty('balance')) {
      this.eventEmitter.emit('account.balanceUpdated', { 
        accountId: accountId,
        balance: updateAccountDto.balance,
      });
      console.log('account.balanceUpdated event emitted')
    }

    return updatedAccount;
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
