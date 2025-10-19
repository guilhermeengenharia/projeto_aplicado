import { Request, Response } from "express";
import Login from '../domain/entities/login';
import { ResponseStatus } from "../validators/response-status";
import { Logger } from "../lib/logger";
import { AuthApplication } from "../application/auth-app";

export default class LoginController {
    constructor(private readonly authApplication: AuthApplication = new AuthApplication()) {
        this.autenticar = this.autenticar.bind(this);
    }

    async autenticar(req: Request, res: Response): Promise<void> {
        try {
            const loginBody: Login = req.body;
            
            Logger.info("Requisição de Login recebida", { email: loginBody.email });
           
            if (!loginBody?.email || !loginBody?.senha) {
                Logger.warn("Dados de autenticação incompletos", loginBody);
                ResponseStatus(res, 400, [], 'Email e senha são obrigatórios');
                return;
            }
           
            const auth = await this.authApplication.autenticador(loginBody);
            
            Logger.info(`Usuário autenticado com sucesso: ${loginBody.email}`);            
            
            ResponseStatus(res, 200, auth, 'Autenticação realizada com sucesso');
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            Logger.error("Falha na autenticação", { error: errorMessage });

            // Tratamento específico para diferentes tipos de erro
            if (error instanceof Error && error.message.includes('credenciais')) {
                ResponseStatus(res, 401, [], 'Credenciais inválidas');
            } else {
                ResponseStatus(res, 500, [], 'Falha ao processar autenticação');
            }
        }
    }
}