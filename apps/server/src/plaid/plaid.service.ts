import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPlaidItemDto, UpdateUserPlaidItemDto } from './dto/index';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { create } from 'domain';
import { AccountsService } from '../accounts/accounts.service';
import { CreateAccountDto } from '../accounts/dto';

@Injectable()
export class PlaidService {
  private plaidClient: PlaidApi;

  constructor(private readonly configService: ConfigService, private readonly databaseService: DatabaseService, private readonly accountsService: AccountsService) {
    const clientId = this.configService.get<string>('plaid.clientId');
    const secret = this.configService.get<string>('plaid.secret');
    const env = this.configService.get<string>('plaid.env') as keyof typeof PlaidEnvironments;

    if (!clientId || !secret || !env) {
      throw new Error('Missing Plaid configuration');
    }

    if (!PlaidEnvironments[env]) {
      throw new Error(`Invalid Plaid environment: ${env}`);
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments[env],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        }
      }
    })

    this.plaidClient = new PlaidApi(configuration);
  }

  async createLinkToken(userId: number) {
    const response = await this.plaidClient.linkTokenCreate({
      user: {
        client_user_id: String(userId),
      },
      client_name: 'Plaid Test App',
      products: [Products.Auth], // Products.Balance is always available
      country_codes: [CountryCode.Us],
      language: 'en',
      // webhook: '',
    });
    return response.data;
  }
  
  async exchangePublicToken(userId: number, publicToken: string) {
    const response = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const dto: CreateUserPlaidItemDto = {
      accessToken: response.data.access_token,
      itemId: response.data.item_id
    }

    await this.createUserPlaidItem(userId, dto)

    await this.importPlaidAccounts(userId, response.data.access_token)

    return response.data;
  }

  async deleteCurrentAccessToken(accessToken: string) {
    const response = await this.plaidClient.itemAccessTokenInvalidate({
      access_token: accessToken,
    });
    return response.data;
  }

  async deleteAccessToken(accessToken: string) {
    const newAccessToken = await this.deleteCurrentAccessToken(accessToken);
    const { new_access_token, ...response } = newAccessToken;
    return response;
  }

  async getAccessItem(accessToken: string) {
    const item = await this.plaidClient.itemGet({
      access_token: accessToken,
    });
    return item.data;
  }

  async getInstitutionById(institutionId: string) {
    const institution = await this.plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
    })
    return institution.data;
  }

  async getInstitution(accessToken: string) {
    const item = await this.getAccessItem(accessToken);
    if (!item || !item.item || !item.item.institution_id) {
      throw new NotFoundException("Institution not found in the Plaid Item");
    }
    const institution = await this.getInstitutionById(item.item.institution_id);
    return institution;
  }

  async getItemAccounts(accessToken: string) {
    const accounts = await this.plaidClient.accountsGet({
      access_token: accessToken,
    });
    return accounts.data;
  }
  
  async getAccounts(accessToken: string) {
    const accounts = await this.getItemAccounts(accessToken);
    return accounts;
  }

  async getAccountsBalance(accessToken: string, accountIds: Array<string>) {
    const auth = await this.plaidClient.accountsBalanceGet({
      access_token: accessToken,
      options: {
        account_ids: accountIds,
      } 
    });
    return auth.data;
  }

  async getBalance(accessToken: string, accountId: string) {
    const auth = await this.getAccountsBalance(accessToken, [accountId]);
    return auth;
  }

  async getAuth(accessToken: string) {
    const auth = await this.getAccessItem(accessToken);
    const auth_response = {
      status_code: auth.status,
      request_id: auth.request_id,
      description: "Authorized",
    }
    return auth_response
  }

  async getUserPlaidItem(userId: number, itemId: string) {
    return this.databaseService.userPlaidItem.findFirst({
      where: {
        userId,
        itemId,
      }
    })
  }

  async createUserPlaidItem(userId: number, createUserPlaidItemDto: CreateUserPlaidItemDto) {
    const item = await this.databaseService.userPlaidItem.create({
      data: { userId, ...createUserPlaidItemDto }
    })
    return item
  }

  async updateUserPlaidItem(userId: number, updateUserPlaidItemDto: UpdateUserPlaidItemDto) {
    const item = await this.databaseService.userPlaidItem.findUnique({
      where: {
        id: userId,
      }
    })

    if (!item) {
      throw new NotFoundException('Resource not found');
    }

    return await this.databaseService.userPlaidItem.update({
      where: {
        id: userId,
      },
      data: updateUserPlaidItemDto
    })
  }

  async removeUserPlaidItem(userId: number, itemId: string) {
    const item = await this.databaseService.userPlaidItem.findUnique({
      where: {
        uniqueUserPlaidItem: {
          userId,
          itemId,
        }
      }
    })

    if (!item) {
      throw new NotFoundException('Resource not found');
    }

    return this.databaseService.userPlaidItem.delete({
      where: {
        uniqueUserPlaidItem: {
          userId,
          itemId,
        }
      }
    })
  }

  transformPlaidAccount(account: any): CreateAccountDto {
    const accountType = account.subtype[0].toUpperCase() + account.subtype.slice(1);
    const transformedAccount: CreateAccountDto = {
      name: account.name || account.official_name,
      accountType,
      balance: account.balances.current || account.balances.available,
      note: 'Imported from Plaid',
    };
    return transformedAccount;
  }

  async importPlaidAccounts(userId: number, accessToken: string) {
    // get plaid accounts
    const plaidAccounts = await this.getAccounts(accessToken);
    
    // transform and create accounts
    const createAccountPromises = plaidAccounts.accounts.map(async account => {
      const transformedAccount: CreateAccountDto = this.transformPlaidAccount(account);
      return this.accountsService.create(userId, transformedAccount);
    });

    const accounts = await Promise.all(createAccountPromises);
    console.log('inserted Plaid accounts', accounts);
    return accounts;

  }

  // async importPlaidAccount(userId: number, publicToken: string) {
  //   // access token
  //   this.exchangePublicToken(userId, publicToken);
  //   // get plaid account
  //   this.getAccounts();
  //   // create account
  // }

  // async getAccountTransactions(accessToken: string, startDate: string, endDate: string, accountId: string) {
  //   const transactionOptions = { account_ids: [accountId] };
  //   const transactions = await this.plaidClient.transactionsGet({
  //     access_token: accessToken,
  //     start_date: startDate,
  //     end_date: endDate,
  //     options: transactionOptions,
  //   });
  //   return transactions.data;
  // }

  // // TODO: move to some utils folder
  // verifyStartEndDateFormat(startDate: string, endDate: string, format: string) {
  //   const isStartDateFormat = moment(startDate, format, true).isValid();
  //   const isEndDateFormat = moment(endDate, format, true).isValid();
  //   return (isStartDateFormat !== true || isEndDateFormat !== true)
  // }

  // async getTransactions(accessToken: string, dates: {startDate: string, endDate: string}, accountId: string) {
  //   const { startDate, endDate } = dates

  //   if (!startDate || !endDate) {
  //     throw new BadRequestException("No transactions start or end date passed")
  //   }

  //   if (this.verifyStartEndDateFormat(startDate, endDate, 'YYYY-MM-DD')) {
  //     throw new BadRequestException("Wrong date format passed")
  //   }

  //   const transactions = await this.getAccountTransactions(accessToken, startDate, endDate, accountId);

  //   return transactions;
  // }

}
