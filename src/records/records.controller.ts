import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('accounts/:accountId/records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.recordsService.findAll(accountId);
  }

  @Get('latest')
  getLatest(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.recordsService.getLatest(accountId)
  }

  @Get(':id')
  findOne(@Param('accountId', ParseIntPipe) accountId: number, @Param('id', ParseIntPipe) recordId: number) {
    return this.recordsService.findOne(accountId, recordId);
  }
  
  @Post()
  create(@Param('accountId', ParseIntPipe) accountId: number, @Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(accountId, createRecordDto);
  }

  @Patch(':id')
  update(@Param('accountId', ParseIntPipe) accountId: number, @Param('id', ParseIntPipe) recordId: number, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(accountId, recordId, updateRecordDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('accountId', ParseIntPipe) accountId: number, @Param('id', ParseIntPipe) recordId: number) {
    return this.recordsService.remove(accountId, recordId);
  }
}
