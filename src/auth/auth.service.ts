import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { DatabaseService } from '../database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MyLogger } from '../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: MyLogger,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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

      return this.signToken(user.id, user.email)
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

    return this.signToken(user.id, user.email)
  }

  async signToken(userId: number, email: string): Promise<{access_token: string}> {
    const payload = {
      sub: userId,
      email
    }

    const token= await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    })

    return { access_token: token }
  }
}
