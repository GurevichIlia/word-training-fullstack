"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ServerErrorInterceptor = class ServerErrorInterceptor {
    constructor(authService) {
        this.authService = authService;
    }
    intercept(request, next) {
        return next.handle(request).pipe(operators_1.retry(1), operators_1.catchError((error) => {
            if (error.status === 401) {
                console.log(error);
                this.authService.logOut();
                // this.modal.open(ModalSessionexpiredComponent, { width: '450px' });
                return rxjs_1.throwError(error);
            }
            else if (error.status === 500) {
                this.authService.logOut();
                console.log(error);
                return rxjs_1.throwError(error);
            }
            else {
                console.log(error);
                return rxjs_1.throwError(error);
            }
        }));
    }
};
ServerErrorInterceptor = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ServerErrorInterceptor);
exports.ServerErrorInterceptor = ServerErrorInterceptor;
//# sourceMappingURL=server-error-interceptor.service.js.map