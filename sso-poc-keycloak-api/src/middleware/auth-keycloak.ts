// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { KeycloakInfra } from '../infrastructure/keycloak';

const keycloak = new KeycloakInfra(); // ou injete via container se usar DI

export function requireAuth(requiredRole?: string) {
  return async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const token = keycloak.extractTokenFromHeader(req);
      if (!token) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
      }

      // Valida token
      const decoded = await keycloak.authenticateToken(token);

      // Se role for exigida, valida
      if (requiredRole) {
        const hasRole = await keycloak.checkRole(token, requiredRole);
        if (!hasRole) {
            res.status(403).json({ error: 'Acesso negado: role ausente' });
            return;
        }
      }
      
      req.user = decoded;
      next();
      
    } catch (err) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }
  };
}
