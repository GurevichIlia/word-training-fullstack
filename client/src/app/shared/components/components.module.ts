import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NbCardModule, NbCheckboxModule, NbInputModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GroupsComponent } from './../../modules/vocabulary/groups/groups.component';
import { WordListComponent } from './../../modules/vocabulary/word-list/word-list.component';
import { WordComponent } from './../../modules/vocabulary/word/word.component';
import { WordCounterComponent } from './../../modules/word-training/word-counter/word-counter.component';
import { ConvertToPercentPipe } from './../pipes/convert-to-percent.pipe';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupStatisticsComponent } from './group-statistics/group-statistics.component';
import { LoaderComponent } from './loader/loader.component';
import { MenuComponent } from './menu/menu.component';
import { ModalUiComponent } from './modal-ui/modal-ui.component';
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [
    ModalUiComponent,
    MenuComponent,
    LoaderComponent,
    GroupStatisticsComponent,
    WordListComponent,
    GroupListComponent,
    GroupsComponent,
    SearchComponent,
    WordComponent,
    WordCounterComponent,

    ConvertToPercentPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    NbCardModule,
    NbSpinnerModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbInputModule,
    InfiniteScrollModule,

  ],
  exports: [
    ModalUiComponent,
    MenuComponent,
    LoaderComponent,
    GroupStatisticsComponent,
    WordListComponent,
    GroupListComponent,
    GroupsComponent,
    SearchComponent,
    WordComponent,
    WordCounterComponent,

    ConvertToPercentPipe

  ],
})
export class ComponentsModule { }
