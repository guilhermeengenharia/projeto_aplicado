import jwt from 'jsonwebtoken';

export default interface DecodedToken extends jwt.JwtPayload {
    preferred_username: string;
    email: string;
    realm_access?: {
      roles: string[];
    };
    resource_access?: {
      [clientId: string]: {
        roles: string[];
      };
    };
  }
  