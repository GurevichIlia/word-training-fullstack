import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule,
  NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule,
  NbLayoutModule, NbListModule, NbMenuModule, NbSelectModule, NbSpinnerModule,
  NbTabsetModule, NbThemeModule, NbToastrModule, NbUserModule, NbProgressBarModule
} from '@nebular/theme';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { HeaderComponent } from './../header/header.component';
import { GroupsComponent } from './../vocabulary/groups/groups.component';
import { FooterComponent } from './components/footer/footer.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';
import { EditWordComponent } from './modals/edit-word/edit-word.component';
import { ConvertToPercentPipe } from './pipes/convert-to-percent.pipe';





@NgModule({
  declarations: [
    AskQuestionComponent,
    FooterComponent,
    GroupsComponent,
    HeaderComponent,

    ConvertToPercentPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
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
    NbAccordionModule,
    NbProgressBarModule

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
    NbAccordionModule,
    NgxPrettyCheckboxModule,
    MatCardModule,
    MatMenuModule,
    NbProgressBarModule,

    FooterComponent,
    GroupsComponent,
    HeaderComponent,

    ConvertToPercentPipe


  ],
  entryComponents: [EditWordComponent, AskQuestionComponent]
})
export class SharedModule { }
