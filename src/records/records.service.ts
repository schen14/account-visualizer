import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RecordsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(accountId: number) {
    return this.databaseService.record.findMany({
      where: {
        accountId,
      }
    });
  }

  async getLatest(accountId: number) {
    return this.databaseService.record.findFirst({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  async findOne(accountId: number, recordId: number) {
    return this.databaseService.record.findFirst({
      where: {
        id: recordId,
        accountId,
      }
    })
  }
  
  async create(accountId: number, createRecordDto: CreateRecordDto) {
    return this.databaseService.record.create({
      data: { accountId, ...createRecordDto }
    })
  }

  async update(accountId: number, recordId: number, updateRecordDto: UpdateRecordDto) {
    const record = await this.databaseService.record.findUnique({
      where: {
        id: recordId,
        accountId,
      }
    })

    if (!record) {
      throw new NotFoundException('Resource not found');
    }

    return this.databaseService.record.update({
      where: {
        id: recordId,
      },
      data: {
        ...updateRecordDto
      }
    });
  }

  async remove(accountId: number, recordId: number) {
    const record = await this.databaseService.record.findUnique({
      where: {
        id: recordId,
        accountId,
      }
    })

    if (!record) {
      throw new NotFoundException('Resource not found');
    }

    return this.databaseService.record.delete({
      where: {
        id: recordId,
      }
    });
  }
}
