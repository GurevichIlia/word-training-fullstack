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
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const words_train_guard_1 = require("./shared/guards/words-train.guard");
const routes = [
    { path: '', pathMatch: 'full', redirectTo: '/vocabulary', },
    { path: 'authorization', loadChildren: () => Promise.resolve().then(() => __importStar(require('./authorization/authorization.module'))).then(m => m.AuthorizationModule) },
    { path: 'languages', loadChildren: () => Promise.resolve().then(() => __importStar(require('./languages/languages.module'))).then(m => m.LanguagesModule) },
    { path: 'word-training', loadChildren: () => Promise.resolve().then(() => __importStar(require('./word-training/word-training.module'))).then(m => m.WordTrainingModule),
        canActivate: [words_train_guard_1.WordsTrainGuard] },
    { path: 'vocabulary', loadChildren: () => Promise.resolve().then(() => __importStar(require('./vocabulary/vocabulary.module'))).then(m => m.VocabularyModule) },
    { path: 'train-result', loadChildren: () => Promise.resolve().then(() => __importStar(require('./train-result/train-result.module'))).then(m => m.TrainResultModule),
        canActivate: [words_train_guard_1.WordsTrainGuard] },
    { path: '**', redirectTo: '/authorization' },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map