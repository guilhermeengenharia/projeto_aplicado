import { Router }    from "express";
import LoginController from "../controllers/login-controller";

class LoginRoutes {
  router = Router();
  controller = new LoginController();
  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.post("/login/auth",this.controller.autenticar);
  }
}
export default new LoginRoutes().router;