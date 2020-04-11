"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const menu_1 = require("@angular/material/menu");
const theme_1 = require("@nebular/theme");
const eva_icons_1 = require("@nebular/eva-icons");
const ngx_pretty_checkbox_1 = require("ngx-pretty-checkbox");
const card_1 = require("@angular/material/card");
const filter_pipe_1 = require("./pipes/filter.pipe");
const edit_word_component_1 = require("./modals/edit-word/edit-word.component");
const ask_question_component_1 = require("./modals/ask-question/ask-question.component");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    core_1.NgModule({
        declarations: [filter_pipe_1.FilterPipe, ask_question_component_1.AskQuestionComponent],
        imports: [
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            theme_1.NbLayoutModule,
            theme_1.NbButtonModule,
            theme_1.NbInputModule,
            theme_1.NbCardModule,
            eva_icons_1.NbEvaIconsModule,
            theme_1.NbSelectModule,
            theme_1.NbListModule,
            theme_1.NbTabsetModule,
            theme_1.NbIconModule,
            theme_1.NbActionsModule,
            theme_1.NbCheckboxModule,
            theme_1.NbSpinnerModule,
            theme_1.NbContextMenuModule,
            theme_1.NbUserModule,
            ngx_pretty_checkbox_1.NgxPrettyCheckboxModule,
            card_1.MatCardModule,
            menu_1.MatMenuModule,
        ],
        exports: [
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            theme_1.NbThemeModule,
            theme_1.NbLayoutModule,
            theme_1.NbButtonModule,
            theme_1.NbInputModule,
            theme_1.NbCardModule,
            eva_icons_1.NbEvaIconsModule,
            theme_1.NbSelectModule,
            theme_1.NbToastrModule,
            theme_1.NbListModule,
            theme_1.NbTabsetModule,
            theme_1.NbIconModule,
            theme_1.NbActionsModule,
            theme_1.NbCheckboxModule,
            theme_1.NbSpinnerModule,
            theme_1.NbContextMenuModule,
            theme_1.NbUserModule,
            theme_1.NbMenuModule,
            ngx_pretty_checkbox_1.NgxPrettyCheckboxModule,
            card_1.MatCardModule,
            filter_pipe_1.FilterPipe,
            menu_1.MatMenuModule
        ],
        entryComponents: [edit_word_component_1.EditWordComponent, ask_question_component_1.AskQuestionComponent]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map