export default interface AuthJWT {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    tokenType: string;
    scope: string;
}