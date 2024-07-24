import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpStatus, HttpCode, UseInterceptors } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { DecimalInterceptor } from '../utils/decimal.interceptor';

@UseGuards(JwtGuard)
@UseInterceptors(DecimalInterceptor)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.accountsService.findAll(userId);
  }
  
  @Get('types')
  getAccountTypes() {
    return this.accountsService.getAccountTypes();
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id', ParseIntPipe) accountId: number) {
    return this.accountsService.findOne(userId, accountId);
  }
  
  @Post()
  create(@GetUser('id') userId: number, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Patch(':id')
  update(@GetUser('id') userId: number, @Param('id', ParseIntPipe) accountId: number, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(userId, accountId, updateAccountDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) accountId: number) {
    return this.accountsService.remove(userId, accountId);
  }
}
