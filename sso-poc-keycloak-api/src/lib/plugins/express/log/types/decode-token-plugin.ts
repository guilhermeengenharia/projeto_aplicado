// src/types/express/index.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface DecodedToken {
    sub?: string; 
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
    [key: string]: any;
  }

  interface Request {
    user?: DecodedToken;
  }
}
