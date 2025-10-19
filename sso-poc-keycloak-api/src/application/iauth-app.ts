
import AuthJWT from '../domain/entities/auth-jwt'
import Login from '../domain/entities/login'

export interface IAuthApp {
    autenticador (login : Login) : Promise<AuthJWT>
}