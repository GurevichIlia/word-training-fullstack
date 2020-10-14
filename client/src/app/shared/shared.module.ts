import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule,
  NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule,
  NbLayoutModule, NbListModule, NbMenuModule,
  NbProgressBarModule, NbSelectModule, NbSpinnerModule,
  NbThemeModule, NbUserModule
} from '@nebular/theme';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GroupsComponent } from '../modules/vocabulary/groups/groups.component';
import { WordComponent } from '../modules/vocabulary/word/word.component';
import { WordCounterComponent } from '../modules/word-training/word-counter/word-counter.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';
import { EditWordComponent } from './modals/edit-word/edit-word.component';
import { ReverseArrayPipe } from './pipes/reverse-array.pipe';





@NgModule({
  declarations: [
    AskQuestionComponent,

    ReverseArrayPipe,
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
    NbIconModule,
    NbActionsModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbUserModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    NbAccordionModule,
    NbProgressBarModule,
    InfiniteScrollModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatDialogModule,
    MatExpansionModule,
    DeviceDetectorModule,

    ComponentsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbThemeModule,
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    NbEvaIconsModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbActionsModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbUserModule,
    NbMenuModule,
    NbAccordionModule,

    NbProgressBarModule,

    ReverseArrayPipe,

    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatExpansionModule,
    DeviceDetectorModule,

    ComponentsModule

  ],
  entryComponents: [EditWordComponent, AskQuestionComponent]
})
export class SharedModule { }
