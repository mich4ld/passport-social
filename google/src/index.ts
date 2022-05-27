import { Strategy } from 'passport-strategy';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { Request } from 'express';

export type ExtractTokenID = (req: Request) => string;
type VerifyCallback = (payload: TokenPayload, verified: any) => any;

export interface IGoogleOptions {
    clientID: string;
    tokenFromRequest?: ExtractTokenID;
}

export class GoogleStrategy extends Strategy {
    public readonly name = "google"
    private readonly options: IGoogleOptions;
    private readonly client: OAuth2Client;
    private readonly verifyCb: VerifyCallback;

    constructor(options: IGoogleOptions, verifyCb: VerifyCallback) {
        if (!options) {
            throw new TypeError('Options argument is required for GoogleStrategy');
        }

        if (!options.clientID) {
            throw new TypeError('GoogleStrategy requires clientID');
        }

        super();
        this.options = options;
        this.verifyCb = verifyCb;
        this.client = new OAuth2Client({
            clientId: options.clientID,
        })
    }

    async authenticate(req: Request) {
        const idToken = this.options.tokenFromRequest ? this.options.tokenFromRequest(req) : req.body.idToken;
        
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: this.options.clientID,
            });
    
            const payload = ticket.getPayload();
            const verified = (err: Error, user: any, info: any) => {
                if (err) return this.error(err);
                if (!user) return this.fail(info);
                return this.success(user, info);
            }

            verified.bind(this);

            if (!payload) {
                throw Error('No payload data');
            }

            this.verifyCb(payload, verified);
        } catch (err) {
            this.fail(err, 401);
        }
    }
}
