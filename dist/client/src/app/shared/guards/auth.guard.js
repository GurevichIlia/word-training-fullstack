"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let AuthGuard = class AuthGuard {
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
    }
    canActivate(next, state) {
        //   return this.afAuth.authState.pipe(
        //     take(1),
        //     map(user => {
        //       return !!user;
        //     }),
        //     tap(loggedIn => {
        //       if (!loggedIn) {
        //         console.log('access denied');
        //         this.router.navigate(['/login']);
        //       }
        //     })
        //   );
        // }
        return this.auth.isAuthenticated();
    }
};
AuthGuard = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map