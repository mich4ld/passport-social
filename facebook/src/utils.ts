import { createHmac } from 'crypto';

export function generateProof(accessToken: string, appSecret: string) {
    return createHmac('sha256', appSecret).update(accessToken).digest('hex');
}