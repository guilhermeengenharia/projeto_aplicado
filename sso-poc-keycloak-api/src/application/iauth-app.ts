
import AuthJWT from '../entities/auth-jwt'
import Login from '../entities/login'

export interface IAuthApp {
    autenticador (login : Login) : Promise<AuthJWT>
}