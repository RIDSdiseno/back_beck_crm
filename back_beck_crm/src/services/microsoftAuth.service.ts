import jwt from 'jsonwebtoken';
import JwksClient  from 'jwks-rsa';


const tenantId = process.env.AZURE_AD_TENANT_ID;
const clientId = process.env.AZURE_AD_CLIENT_ID;

if(!tenantId || !clientId) {
    throw new Error('Faltan variantes de entrno de Azure AD')
}

const client = JwksClient({
    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
})

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback){
    if (!header.kid){
        callback(new Error('Token sin kid'));
        return;
    }

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err);
            return;
        }
        const signingKey = key?.getPublicKey();
        if (!signingKey){
            callback(new Error('No se pudo obtener la clave publica'));
            return;
        }

        callback(null, signingKey);
    });
}

export interface MicrosoftTokenPayload extends jwt.JwtPayload {
    oid? : string;
    name? : string;
    preferred_username?: string;
    email?: string;
    tid?: string;
}

export const verifyMicrosoftToken = (
    token: string
): Promise<MicrosoftTokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            {
                audience: clientId,
                issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
                algorithms: ['RS256'],
            },
            (err, decoded) =>{
                if (err) {
                    reject(err);
                    return;
                }

                resolve(decoded as MicrosoftTokenPayload);
            }
        );
    });
};