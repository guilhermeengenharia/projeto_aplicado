import { Router } from "express";
import ProtegidoController from "../controllers/protegido-controller";
import { requireAuth } from '../middleware/auth-keycloak';

class ProtegidoRoutes {
  router = Router();
  controller = new ProtegidoController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/simulacao-protegido",
      requireAuth(),
      this.controller.simular
    );
    this.router.post(
      "/simulacao-protegido-admin",
      requireAuth('ADMIN'),
      this.controller.simularRoles
    );
  }
}

export default new ProtegidoRoutes().router;
