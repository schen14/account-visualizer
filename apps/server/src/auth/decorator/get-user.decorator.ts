import { ExecutionContext, createParamDecorator } from "@nestjs/common";

/*
Instead of needing to do @Req() req: Express.Request and then req.user for routes that need it,
this custom decorator will do the necessary work for me
*/
export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        return data ? (request.user as any)[data] : request.user;
    },
);