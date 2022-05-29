import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import axios from 'axios';
import { generateProof } from './utils';

export interface IFacebookOptions {
    appSecret?: string;
    tokenFromRequest?: any;
    apiVersion?: string;
}

export interface IFacebookProfile {
    id: string;
    email: string;
    name: string;
    picture: {
        data: {
            url: string;
        }
    }
}

interface IParams {
    [x: string]: string;
}

type VerifyCallback = (profile: IFacebookProfile, verified: any) => any;

export class FacebookStrategy extends Strategy {
    public readonly name = "facebook";
    private readonly fields = ['id', 'email', 'name', 'picture'];
    private apiUrl: string;

    constructor(
        private options: IFacebookOptions = {}, 
        private verifyCb: VerifyCallback
    ) {
        super();
        this.apiUrl = `https://graph.facebook.com/${options.apiVersion || 'v14.0'}/me`;
    }

    private validateToken(accessToken: unknown) {
        if (!accessToken) {
            throw Error('accessToken is required');
        }

        if (typeof accessToken !== 'string') {
            throw Error('accessToken must be string');
        }

        if (accessToken.trim().length < 1) {
            throw Error('accessToken must be not empty string');
        }
    }

    async authenticate(req: Request) {
        const accessToken = this.options.tokenFromRequest ? 
            this.options.tokenFromRequest(req) : req.body.accessToken;
        
        try {
            this.validateToken(accessToken);
            const params: IParams = {
                'access_token': accessToken,
                'fields': this.fields.join(','),
            }

            if (this.options.appSecret) {
                params['appsecret_proof'] = generateProof(accessToken, this.options.appSecret);
            }

            const result = await axios.get<IFacebookProfile>(this.apiUrl, { params });
    
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