import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { CreateUserPlaidItemDto, UpdateUserPlaidItemDto } from './dto/';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Post('link-token')
  async createLinkToken(@GetUser('id') userId: number) {
    return await this.plaidService.createLinkToken(userId);
  }

  @Post('access-token')
  async exchangePublicToken(@GetUser('id') userId: number, @Body('public_token') publicToken: string) {
    return this.plaidService.exchangePublicToken(userId, publicToken);
  }

  @Delete('access-token')
  async deleteAccessToken(@Query('access_token') accessToken: string) {
    return this.plaidService.deleteAccessToken(accessToken);
  }

  @Get('accounts')
  async getAccounts(@Query('access_token') accessToken: string) {
    return await this.plaidService.getAccounts(accessToken);
  }

  @Get('balance')
  async getBalance(@Query('access_token') accessToken: string, @Query('account_id') accountId: string) {
    return await this.plaidService.getBalance(accessToken, accountId);
  }

  @Get('item')
  async getItem(@Query('access_token') accessToken: string) {
    return this.plaidService.getAccessItem(accessToken);
  }

  @Get('institution')
  async getInstitution(@Query('access_token') accessToken: string) {
    return this.plaidService.getInstitution(accessToken);
  }

  @Get('auth')
  async getAuth(@Query('access_token') accessToken: string) {
    return this.plaidService.getAuth(accessToken);
  }
}
