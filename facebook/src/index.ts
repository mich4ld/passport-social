import { Request } from 'express';
import { Strategy } from 'passport-strategy';

export interface IFacebookOptions {
    appID: string;
    tokenFromRequest: any;
}

type VerifyCallback = (profile: any, verified: any) => any;

export class FacebookStrategy extends Strategy {
    public readonly name = "facebook";

    constructor(
        private options: IFacebookOptions, 
        private verifyCb: VerifyCallback
    ) {
        super();
    }

    async authenticate(req: Request, options?: any) {
            
    }
}