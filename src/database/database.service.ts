import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
    };

    cleanDb() {
        return this.$transaction([
            this.record.deleteMany(),
            this.account.deleteMany(),
            this.user.deleteMany(),
        ])
    };
}
