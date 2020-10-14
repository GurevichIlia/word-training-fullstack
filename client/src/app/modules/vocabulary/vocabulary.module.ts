import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
import { SelectLanguageGuardGuard } from 'src/app/shared/guards/select-language-guard.guard';
import { ComponentsModule } from './../../shared/components/components.module';
import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';
import { CsvManagerComponent } from './csv-manager/csv-manager.component';
import { VocabularyComponent } from './vocabulary.component';



const vocabularyRoutes: Routes = [
  { path: '', component: VocabularyComponent, canActivate: [SelectLanguageGuardGuard] }
];


@NgModule({
  declarations: [
    VocabularyComponent,
    AssignWordListComponent,
    CsvManagerComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NbInputModule,

    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    RouterModule.forChild(vocabularyRoutes)
  ],
})
export class VocabularyModule { }
