import { TokenPayload } from 'google-auth-library';
import { Strategy } from '../src';
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
            body: { credential: process.env.TOKEN }
        }
        const profile = await fakeProfileRequest(mockRequest);
        expect(profile).toBeDefined();
        expect(typeof profile.name).toEqual('string');
        expect(typeof profile.sub).toEqual('string');
    })
})

function fakeProfileRequest(req: object) {
    return new Promise<TokenPayload>((resolve, reject) => {
        const strategy = new Strategy({
            clientID: process.env.CLIENT_ID as string,
        }, (profile) => {
            resolve(profile);
        });
    
        try {
            strategy.authenticate(req as Request);
        } catch (err) {
            reject(err);
        }
    })
}