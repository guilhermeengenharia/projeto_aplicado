import {Login, DecodedToken, AuthJWT} from "../entities/";
import { Logger } from "../lib/logger";
import { env } from "../env";
import axios from "axios";
import { URLSearchParams } from "url";
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request } from 'express';

export class KeycloakInfra {
    private readonly jwksClient = jwksClient({
        jwksUri: `${env.KeyCloakClientUrl}/realms/${env.KeyCloakRealm}/protocol/openid-connect/certs`
    });

    async autenticador(login: Login): Promise<AuthJWT> {
        try {
            
            const response = await axios.post(
                `${env.KeyCloakClientUrl}/realms/${env.KeyCloakRealm}/protocol/openid-connect/token`,
                new URLSearchParams({
                    grant_type: 'password',
                    client_id: env.KeyCloakClientId,
                    client_secret: env.KeyCloakClientSecret,
                    username: login.email,
                    password: login.senha
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status !== 200 || !response.data.access_token) {
                throw new Error('Failed to authenticate with Keycloak');
            }

            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                expiresIn: response.data.expires_in,
                refreshExpiresIn: response.data.refresh_expires_in,
                tokenType: response.data.token_type,
                scope: response.data.scope
            };
            
        } catch (error) {
            Logger.error(`Error during authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new Error('Authentication failed');
        }
    }


    async authenticateToken(token: string): Promise<DecodedToken> {
        const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
          this.jwksClient.getSigningKey(header.kid!, (err, key) => {
            const signingKey = key?.getPublicKey();
            callback(err, signingKey);
          });
        };
      
        return new Promise((resolve, reject) => {
          jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
              Logger.error(`JWT verification error: ${err.message}`);
              return reject(new Error('Token verification failed'));
            }
            resolve(decoded as DecodedToken);
          });
        });
      }
      

    async checkRole(token: string, requiredRole: string): Promise<boolean> {
        try {
          const decoded = await this.authenticateToken(token);
      
          const realmRoles = decoded.realm_access?.roles || [];
          const clientRoles = decoded.resource_access?.[env.KeyCloakClientId]?.roles || [];
      
          return realmRoles.includes(requiredRole) || clientRoles.includes(requiredRole);
        } catch (error) {
          Logger.error(`Error checking role: ${error instanceof Error ? error.message : 'Unknown error'}`);
          throw new Error('Role verification failed');
        }
    }
      

    // Método auxiliar para extrair token do header
    extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}