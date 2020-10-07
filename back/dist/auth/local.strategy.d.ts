import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ModuleRef } from '@nestjs/core';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private moduleRef;
    constructor(authService: AuthService, moduleRef: ModuleRef);
    validate(request: Request, username: string, password: string): Promise<any>;
}
export {};
