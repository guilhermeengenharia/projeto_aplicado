import { Request, Response } from "express";
import { ResponseStatus } from "../validators/response-status";
import { Logger } from "../lib/logger";

export default class ProtegidoController {
    async simular(req: Request, res: Response): Promise<void> {

        ResponseStatus(res, 200, [], 'Simulação realizado com sucesso');
    
    }

    async simularRoles(req: Request, res: Response): Promise<void> {

        ResponseStatus(res, 200, [], 'Simulação Roles Admin realizado com sucesso');
    
    }
}