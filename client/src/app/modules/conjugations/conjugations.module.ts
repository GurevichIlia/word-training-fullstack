import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbCheckboxModule, NbInputModule, NbToggleModule } from '@nebular/theme';
import { CsvManagerModule } from '../vocabulary/csv-manager/csv-manager.module';
import { CsvVerbsInputComponent } from './components/csv-verbs-input/csv-verbs-input.component';
import { VerbsInputComponent } from './components/verbs-input/verbs-input.component';
import { ConjugationsRoutingModule } from './conjugations-routing.module';
import { ConjugationsComponent } from './conjugations.component';



@NgModule({
  declarations: [
    ConjugationsComponent,
    VerbsInputComponent,
    CsvVerbsInputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConjugationsRoutingModule,
    CsvManagerModule,
    NbCardModule,
    NbInputModule,
    NbCheckboxModule,
    NbToggleModule
  ]
})
export class ConjugationsModule { }
