"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
class AuthRoutes {
    constructor() {
        this.authController = new auth_1.AuthController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post('/login', this.authController.login);
        this.router.post('/registration', this.authController.registration);
        this.router.get('/getUserId', passport_1.default.authenticate("jwt", { session: false }), this.authController.getUserId);
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.js.map