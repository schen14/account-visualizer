import { AuthGuard } from "@nestjs/passport";

// This custom guard just wraps AuthGuard('jwt') so I can avoid verbosity/magic string
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}