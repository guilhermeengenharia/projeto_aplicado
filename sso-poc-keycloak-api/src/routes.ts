import { Application } from "express";
import HealthRoutes from './route/health-route'
import LoginRoutes from './route/login-route'
import ProtegidoRoutes from './route/protegido-router'

export default class Routes {

    constructor(app: Application) {
      let v1Router = "/v1";
      app.use('', HealthRoutes);
      app.use(v1Router, LoginRoutes);
      app.use(v1Router,ProtegidoRoutes);
    }
}