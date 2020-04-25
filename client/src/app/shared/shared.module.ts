import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import {
  NbThemeModule, NbLayoutModule, NbSidebarModule, NbButtonModule,
  NbInputModule, NbCardModule, NbSelectModule, NbToastrModule, NbListModule,
  NbTabsetModule, NbIconModule, NbActionsModule, NbCheckboxModule, NbSpinnerModule,
  NbContextMenuModule, NbUserModule, NbMenuModule, NbDialogModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { FilterPipe } from './pipes/filter.pipe';
import { EditWordComponent } from './modals/edit-word/edit-word.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';





@NgModule({
  declarations: [FilterPipe, AskQuestionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    NbEvaIconsModule,
    NbSelectModule,
    NbListModule,
    NbTabsetModule,
    NbIconModule,
    NbActionsModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbUserModule,
    NgxPrettyCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    NbThemeModule,
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    NbEvaIconsModule,
    NbSelectModule,
    NbToastrModule,
    NbListModule,
    NbTabsetModule,
    NbIconModule,
    NbActionsModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbUserModule,
    NbMenuModule,
    NgxPrettyCheckboxModule,
    MatCardModule,
    FilterPipe,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule
    

  ],
  entryComponents: [EditWordComponent, AskQuestionComponent]
})
export class SharedModule { }
