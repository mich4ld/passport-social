import { Strategy } from 'passport-strategy';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { Request } from 'express';

type VerifyCallback = (payload: TokenPayload, verified: any) => any;

export interface IGoogleOptions {
    clientID: string;
}

export class GoogleStrategy extends Strategy {
    public readonly name = "google"
    private readonly client: OAuth2Client;

    constructor(
        private readonly options: IGoogleOptions, 
        private readonly verifyCb: VerifyCallback
    ) {
        if (!options || !options.clientID) {
            throw new TypeError('GoogleStrategy requires clientID');
        }

        super();
        this.client = new OAuth2Client({
            clientId: options.clientID,
        })
    }

    private validateCsrfToken(req: Request) {
        const csrfTokenCookie = req.cookies['g_csrf_token'];
        const csrfTokenBody = req.body['g_csrf_token'];

        if (!csrfTokenBody || !csrfTokenCookie) {
            throw new Error('Invalid CSRF tokens');
        }

        if (csrfTokenBody !== csrfTokenCookie) {
            throw new Error('Invalid CSRF tokens');
        }
    }

    async authenticate(req: Request) {
        const idToken = req.body.credential;
        
        try {
            this.validateCsrfToken(req);

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