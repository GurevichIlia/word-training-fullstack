import { AuthController } from '../controllers/auth';
import { Router } from 'express'
import passport from 'passport';


export class AuthRoutes {
      router: Router;
      authController: AuthController = new AuthController();

      constructor() {
            this.router = Router()
            this.routes()
      }

      routes() {
            // this.router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
            // this.router.get('/google/callback', passport.authenticate('google'), this.authController.googleLogin)
            this.router.post('/login', this.authController.login);
            this.router.post('/registration', this.authController.registration)
            this.router.get('/getCurrentUser', passport.authenticate("jwt", { session: false }), this.authController.getCurrentUser)
            this.router.get('/getUserId', passport.authenticate("jwt", { session: false }), this.authController.getUserId)
      }
}