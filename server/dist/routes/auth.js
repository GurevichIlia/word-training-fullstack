"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const express_1 = require("express");
class AuthRoutes {
    constructor() {
        this.authController = new auth_1.AuthController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post('/login', this.authController.login);
        this.router.post('/registration', this.authController.registration);
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.js.map