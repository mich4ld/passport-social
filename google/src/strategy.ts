import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

type VerifyCallback = ((...args: any) => void)

export interface GoogleStrategyOptions {
    clientID: string;
    tokenFromRequest?: (req: Request) => string;
    csrfCheck?: boolean;
    passReqToCallback?: boolean;
}

export class GoogleStrategy extends Strategy {
    public readonly name = "google"
    private readonly client: OAuth2Client;

    constructor(
        private readonly options: GoogleStrategyOptions, 
        private readonly verifyCb: VerifyCallback
    ) {
        super();
        if (!options || !options.clientID) {
            throw new TypeError('GoogleStrategy requires clientID');
        }
        
        this.client = new OAuth2Client({
            clientId: options.clientID,
        });
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

    private validateToken(idToken: unknown) {
        if (!idToken) {
            throw Error('accessToken is required');
        }

        if (typeof idToken !== 'string') {
            throw Error('accessToken must be string');
        }

        if (idToken.trim().length < 1) {
            throw Error('accessToken must be not empty string');
        }
    }

    async authenticate(req: Request) {
        const idToken = this.options.tokenFromRequest 
            ? this.options.tokenFromRequest(req)
            : req.body.credential;
        
        try {
            if (this.options.csrfCheck) {
                this.validateCsrfToken(req);
            }

            this.validateToken(idToken);
            
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

            if (this.options.passReqToCallback) {
                this.verifyCb(req, payload, verified);
            } else {
                this.verifyCb(payload, verified);
            }
            
        } catch (err) {
            this.fail(err, 401);
        }
    }
}