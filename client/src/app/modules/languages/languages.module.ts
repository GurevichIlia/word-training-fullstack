import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewLanguageComponent } from './new-language/new-language.component';
import { LanguagesComponent } from './languages.component';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { LanguagesService } from './languages.service';
import { EditLanguageComponent } from './edit-language/edit-language.component';
import { SharedModule } from 'src/app/shared/shared.module';
const languageRoutes: Routes = [
  { path: '', component: LanguagesComponent }
];


@NgModule({
  declarations: [
    NewLanguageComponent,
    LanguagesComponent,
    SelectLanguageComponent,
    EditLanguageComponent],
  imports: [

    SharedModule,
    RouterModule.forChild(languageRoutes)
  ],
  providers: [LanguagesService]
})
export class LanguagesModule { }
