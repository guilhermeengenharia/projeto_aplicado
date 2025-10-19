import * as dotenv from "dotenv";
dotenv.config();

export const env = {
    NODE_ENV: 'local',
    CORS_ORIGIN : '',
    PORT : '7007',
    KeyCloakRealm : 'KenloOpen',
    KeyCloakClientId : 'kenlo-open',
    KeyCloakClientSecret : 'BLa89lRRZxSyMerc3gijsKGrTr8zEVKu',
    KeyCloakClientUrl : 'http://localhost:8080',

}