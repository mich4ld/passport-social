import { Strategy } from '../src';
import { Request } from 'express';
import { IFacebookProfile } from '../src/strategy';

describe('Test strategy', () => {
    it('should be exported properly', () => {
        expect(Strategy).toBeDefined();
    })

    it('should handle undefined argument as option', () => {
        expect(() => {
            new Strategy(undefined, () => {});
        }).not.toThrow();
    });

    it('should successfuly return facebook profile', async () => {
        const accessToken = process.env.TOKEN; // provide your own token from Facebook Graph playground. Run TOKEN={your_token} yarn test

        const mockRequest = {
            body: {
                accessToken
            }
        }

        const profile = await fakeProfileRequest(mockRequest);
        expect(profile).toBeDefined();
        expect(typeof profile.name).toEqual('string');
        expect(typeof profile.id).toEqual('string');
    })
});

function fakeProfileRequest(req: object) {
    return new Promise<IFacebookProfile>((resolve, reject) => {
        const strategy = new Strategy({}, (profile) => {
            resolve(profile);
        });
    
        try {
            strategy.authenticate(req as Request);
        } catch (err) {
            reject(err);
        }
    })
}