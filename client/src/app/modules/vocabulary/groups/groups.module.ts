import { MatFormFieldModule } from '@angular/material/form-field';
import { NbInputModule } from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupsService } from './services/groups.service';
import { NgModule } from '@angular/core';

import { GroupsComponent } from './groups.component';
import { GroupsApiService } from './services/groups-api.service';
import { MenuModule } from 'src/app/shared/components/menu/menu.module';
import { GroupListModule } from 'src/app/shared/components/group-list/group-list.module';
import { ModalUiModule } from 'src/app/shared/components/modal-ui/modal-ui.module';
import { groupsReducer, GROUPS_REDUCER_NODE } from './store/reducers/groups.reducers';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    GroupListModule,
    ModalUiModule,
    ReactiveFormsModule,
    NbInputModule,

    MatFormFieldModule
  ],
  exports: [
    GroupsComponent
  ],
  declarations: [
    GroupsComponent
  ],
  providers: [
    GroupsApiService,
  ],
})
export class GroupsModule { }
