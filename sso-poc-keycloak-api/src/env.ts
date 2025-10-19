import * as dotenv from "dotenv";
dotenv.config();

export const env = {
    NODE_ENV: 'local',
    CORS_ORIGIN : '',
    PORT : '7007',
    KeyCloakRealm : 'produtos',
    KeyCloakClientId : 'IntegradorExterno',
    KeyCloakClientSecret : 'GnNPwMM19xHBRvUPM9snrHOQECJvY9dR',
    KeyCloakClientUrl : 'http://localhost:8080',

}