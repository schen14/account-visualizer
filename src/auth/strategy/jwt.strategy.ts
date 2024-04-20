import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { DatabaseService } from "src/database/database.service"

type Payload = {
    sub: number;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService, 
        private database: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    // The output will be added as "user" attribute to the Express request ( request.user = the return output )
    // The const name does not matter
    async validate(payload: Payload) {
        const user = await this.database.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        delete user.password
        return user
    }
}