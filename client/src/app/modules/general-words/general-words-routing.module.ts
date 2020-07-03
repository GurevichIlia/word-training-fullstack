import { SelectLanguageGuardGuard } from './../../shared/guards/select-language-guard.guard';
import { GeneralWordsComponent } from './general-words.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: GeneralWordsComponent , canActivate: [SelectLanguageGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralWordsRoutingModule { }
