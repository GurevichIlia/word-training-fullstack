import { AuthController } from '../controllers/auth';
import { Router } from 'express'


export class AuthRoutes {
      router: Router;
      authController: AuthController = new AuthController();

      constructor() {
            this.router = Router()
            this.routes()
      }

      routes() {
            this.router.post('/login', this.authController.login);
            this.router.post('/registration', this.authController.registration)
      }
}