import { Router } from "express";
import { Request, Response } from "express";

class HealthRoutes {
    router = Router();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.get("/health", (req: Request, res: Response) => {
            res.send({"status":'ok'});
        });
    }
}

export default new HealthRoutes().router;