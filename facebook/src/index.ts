import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import axios from 'axios';

export interface IFacebookOptions {
    appID: string;
    tokenFromRequest: any;
}

type VerifyCallback = (profile: any, verified: any) => any;

export class FacebookStrategy extends Strategy {
    public readonly name = "facebook";
    private readonly fields = ['id', 'email', 'name'];

    constructor(
        private options: IFacebookOptions, 
        private verifyCb: VerifyCallback
    ) {
        if (!options || !options.appID) {
            throw new TypeError('FacebookStrategy requires appID');
        }

        super();
    }

    async authenticate(req: Request) {
        const accessToken = this.options.tokenFromRequest ? 
            this.options.tokenFromRequest(req) : req.body.accessToken;

        const url = "https://graph.facebook.com/me";
        
        try {
            const result = await axios.get(url, {
                params: {
                    'access_token': accessToken,
                    'fields': this.fields.join(','),
                },
            })
    
            const verified = (err: Error, user: any, info: any) => {
                if (err) return this.error(err);
                if (!user) return this.fail(info);
                return this.success(user, info);
            }
    
            verified.bind(this);
    
            if (!result.data) {
                throw new Error('No payload data');
            }
    
            this.verifyCb(result.data, verified);
        } catch (err) {
            this.fail(err, 401);
        }
    }
}