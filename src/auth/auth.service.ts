import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: MyLogger,
  ) {
    this.logger.setContext(AuthService.name)
  }

  async register(registerDto: RegisterDto) {
    await argon
            .hash(registerDto.password)
            .then(pwd => {registerDto.password = pwd;})

    try {
      const user = await this.databaseService.user.create({
        data: registerDto
      })

      return 'done'
    } catch(error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Invalid email')
        }
      }
      throw error
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: loginDto.email
      }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const pwMatches = await argon.verify(user.password, loginDto.password)
    if (!pwMatches) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return 'logged in'
  }
}
