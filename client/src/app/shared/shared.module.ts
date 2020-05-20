import { HeaderComponent } from './../header/header.component';
import { GroupsComponent } from './../vocabulary/groups/groups.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';


import {
  NbThemeModule, NbLayoutModule, NbSidebarModule, NbButtonModule,
  NbInputModule, NbCardModule, NbSelectModule, NbToastrModule, NbListModule,
  NbTabsetModule, NbIconModule, NbActionsModule, NbCheckboxModule, NbSpinnerModule,
  NbContextMenuModule, NbUserModule, NbMenuModule, NbDialogModule, NbAccordionModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { MatCardModule } from '@angular/material/card';
import { FilterPipe } from './pipes/filter.pipe';
import { EditWordComponent } from './modals/edit-word/edit-word.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from '../modules/home/home/home.component';



@NgModule({
  declarations: [
    FilterPipe,
    AskQuestionComponent,
    FooterComponent,
    GroupsComponent,
    HeaderComponent
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
    FilterPipe,
    MatMenuModule,


    FooterComponent,
    GroupsComponent,
    HeaderComponent



  ],
  entryComponents: [EditWordComponent, AskQuestionComponent]
})
export class SharedModule { }
