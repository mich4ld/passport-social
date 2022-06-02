import { TokenPayload } from 'google-auth-library';
import { GoogleStrategyOptions, IGoogleProfile, Strategy } from '../src';
import { Request } from 'express';
import { config } from 'dotenv';
config();

describe('Strategy test', () => {
    it('should export correctly', () => {
        expect(Strategy).toBeDefined();
    })

    it('should fail without clientID provided', () => {
        expect(() => {
            // @ts-ignore
            new Strategy({}, () => {});
        }).toThrow();
    })

    it('should return profile', async () => {
        const mockRequest = {
            body: { idToken: process.env.TOKEN }
        }
        const profile = await fakeProfileRequest(mockRequest, {
            tokenFromRequest(req) {
                expect(req.body.idToken).toEqual(mockRequest.body.idToken);
                return req.body.idToken;
            },
        });

        expect(profile).toBeDefined();
        expect(typeof profile.name).toEqual('string');
        expect(typeof profile.sub).toEqual('string');
    })
})

function fakeProfileRequest(req: object, options: Partial<GoogleStrategyOptions> = {}) {
    return new Promise<IGoogleProfile>((resolve, reject) => { 
        try {
            const strategy = new Strategy({
                clientID: process.env.CLIENT_ID as string,
                ...options
            }, (profile) => {
                resolve(profile);
            });

            strategy.fail = (challange: any) => {
                reject(challange);
            }

            strategy.authenticate(req as Request);
        } catch (err) {
            reject(err);
        }
    })
}