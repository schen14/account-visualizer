import { DynamicModule, Module } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { PlaidController } from './plaid.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from '../database/database.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({})
export class PlaidModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PlaidModule,
      controllers: [PlaidController],
      imports: [ConfigModule.forRoot(), DatabaseModule, AccountsModule],
      providers: [
        PlaidService,
        {
          provide: 'PLAID_API_KEY',
          useFactory: async (configService: ConfigService) => configService.get('PLAID_API_KEY'),
          inject: [ConfigService],
        }
      ]
    }
  }
}
