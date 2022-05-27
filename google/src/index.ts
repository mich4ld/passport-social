import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy } from 'passport-strategy';
import { ParsedQs } from 'qs';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

type ExpressReq = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
type ExtractTokenID = (req: ExpressReq) => string;
type VerifyCallback = (payload: TokenPayload) => any;

export interface IGoogleOptions {
    clientID: string;
    clientSecret: string;
    tokenFromRequest?: ExtractTokenID;
}

export class GoogleStrategy extends Strategy {
    private readonly options: IGoogleOptions;
    private readonly client: OAuth2Client;
    private readonly verifyCb: VerifyCallback;

    constructor(options: IGoogleOptions, verifyCb: any) {
        if (!options.clientID) {
            throw new TypeError('GoogleStrategy requires clientID');
        }
    
        if (!options.clientSecret) {
            throw new TypeError('GoogleStrategy requried clientSecret');
        }

        super();
        this.options = options;
        this.verifyCb = verifyCb;
        this.client = new OAuth2Client({
            clientSecret: options.clientSecret,
            clientId: options.clientID,
        })
    }

    async authenticate(req: ExpressReq) {
        const idToken = this.options.tokenFromRequest ? this.options.tokenFromRequest(req) : req.body.idToken;
        
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: this.options.clientID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw Error('No payload data');
        }

        this.verifyCb(payload);
    }
}
