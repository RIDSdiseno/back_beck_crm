import jwt from 'jsonwebtoken';
import JwksClient, { SigningKey } from 'jwks-rsa';


let cachedTenantId: string | undefined;
let cachedClient: ReturnType<typeof JwksClient> | undefined;

function getMicrosoftAuthContext(): {
    tenantId: string;
    clientId: string;
    client: ReturnType<typeof JwksClient>;
} {
    const tenantId = process.env.AZURE_AD_TENANT_ID;
    const clientId = process.env.AZURE_AD_CLIENT_ID;

    if (!tenantId || !clientId) {
        throw new Error('Login de Microsoft no configurado: faltan AZURE_AD_TENANT_ID o AZURE_AD_CLIENT_ID');
    }

    if (!cachedClient || cachedTenantId !== tenantId) {
        cachedTenantId = tenantId;
        cachedClient = JwksClient({
            jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
        });
    }

    const client = cachedClient;

    if (!client) {
        throw new Error('No se pudo inicializar el cliente de Microsoft');
    }

    return {
        tenantId,
        clientId,
        client,
    };
}

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback){
    let client: ReturnType<typeof JwksClient>;

    try {
        ({ client } = getMicrosoftAuthContext());
    } catch (error) {
        callback(error instanceof Error ? error : new Error('Error de configuración de Microsoft'));
        return;
    }

    if (!header.kid){
        callback(new Error('Token sin kid'));
        return;
    }

    client.getSigningKey(header.kid, (err: Error | null, key?: SigningKey) => {
        if (err || !key) {
            callback(err ?? new Error('No signing key'));
            return;
        }
        const signingKey = key.getPublicKey();
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
        let tenantId: string;
        let clientId: string;

        try {
            ({ tenantId, clientId } = getMicrosoftAuthContext());
        } catch (error) {
            reject(error);
            return;
        }

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
