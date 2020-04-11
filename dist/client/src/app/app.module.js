"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_error_interceptor_service_1 = require("./shared/services/server-error-interceptor.service");
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const animations_1 = require("@angular/platform-browser/animations");
const http_1 = require("@angular/common/http");
const platform_browser_2 = require("@angular/platform-browser");
const token_interceptor_service_1 = require("./shared/services/token-interceptor.service");
const shared_module_1 = require("./shared/shared.module");
const app_routing_module_1 = require("./app-routing.module");
const app_component_1 = require("./app.component");
const header_component_1 = require("./header/header.component");
const Hammer = __importStar(require("hammerjs"));
const theme_1 = require("@nebular/theme");
let MyHammerConfig = class MyHammerConfig extends platform_browser_2.HammerGestureConfig {
    constructor() {
        super(...arguments);
        this.overrides = {
            'swipe': { direction: Hammer.DIRECTION_ALL }
        };
    }
};
MyHammerConfig = __decorate([
    core_1.Injectable()
], MyHammerConfig);
exports.MyHammerConfig = MyHammerConfig;
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            header_component_1.HeaderComponent,
        ],
        imports: [
            animations_1.BrowserAnimationsModule,
            platform_browser_1.BrowserModule,
            platform_browser_1.HammerModule,
            app_routing_module_1.AppRoutingModule,
            shared_module_1.SharedModule,
            http_1.HttpClientModule,
            theme_1.NbToastrModule.forRoot(),
            theme_1.NbMenuModule.forRoot(),
            theme_1.NbThemeModule.forRoot({ name: 'default' }),
            theme_1.NbSidebarModule.forRoot(),
            theme_1.NbDialogModule.forRoot(),
        ],
        providers: [
            { provide: http_1.HTTP_INTERCEPTORS, useClass: token_interceptor_service_1.TokenInterceptorService, multi: true },
            { provide: http_1.HTTP_INTERCEPTORS, useClass: server_error_interceptor_service_1.ServerErrorInterceptor, multi: true },
            { provide: platform_browser_2.HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map