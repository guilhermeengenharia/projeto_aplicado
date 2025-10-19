// src/utils/key-utils.ts
export function rsaPublicKeyToPEM(key: string): string {
    const PEM_PREFIX = '-----BEGIN PUBLIC KEY-----\n';
    const PEM_SUFFIX = '\n-----END PUBLIC KEY-----';
    return PEM_PREFIX + key.match(/.{1,64}/g)?.join('\n') + PEM_SUFFIX;
}

export function certToPEM(cert: string): string {
    const PEM_PREFIX = '-----BEGIN CERTIFICATE-----\n';
    const PEM_SUFFIX = '\n-----END CERTIFICATE-----';
    return PEM_PREFIX + cert.match(/.{1,64}/g)?.join('\n') + PEM_SUFFIX;
}