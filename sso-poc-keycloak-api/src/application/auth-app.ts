import AuthJWT from "../domain/entities/auth-jwt";
import Login from "../domain/entities/login";
import { KeycloakInfra } from "../infrastructure/keycloak";
import { Logger } from "../lib/logger";
import { IAuthApp } from "./iauth-app";

export class AuthApplication implements IAuthApp {
    constructor(private readonly authService: KeycloakInfra = new KeycloakInfra()) {}
    
    async autenticador(loginData: Login): Promise<AuthJWT> {
        try {
            Logger.info(`Authentication attempt for user: ${loginData.email}`);
            
            const authTokens = await this.authService.autenticador(loginData);
            
            Logger.info(`Authentication successful for user: ${loginData.email}`);
            return authTokens;
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
            Logger.error(`Authentication failed for user ${loginData.email}: ${errorMessage}`);
            throw new Error('Authentication service unavailable');
        }
    }
}