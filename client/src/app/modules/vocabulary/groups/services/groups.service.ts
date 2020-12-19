import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { GeneralFacade } from '../../../../general.facade';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { GroupMenuItem, MenuItem } from 'src/app/core';
import { WordGroup } from 'src/app/shared/interfaces';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { GroupsApiService } from 'src/app/modules/vocabulary/groups/services/groups-api.service';
import { GroupAction, DefaultGroupId } from '../../../../core/enums';
import { ISaveGroupResponse } from '../types/groups-state.interface';

@Injectable({ providedIn: 'root' })
export class GroupsService {

  selectedGroup$: Observable<WordGroup>
  constructor(
    private groupsApi: GroupsApiService,
    private dialogService: NbDialogService,
  ) { }


  getWordsGroups$(language: LanguageInterface): Observable<WordGroup[]> {
    return this.groupsApi.getAllWordsGroups(language)

  }

  saveGroup(name: string, selectedGroup?: WordGroup): Observable<ISaveGroupResponse> {
    const groupId = selectedGroup ? selectedGroup._id : '';

    return this.groupsApi.saveGroup(name, groupId)
  }

  deleteWordGroup(group: WordGroup): Observable<WordGroup[]> {
    return this.groupsApi.deleteWordGroup(group._id)
      .pipe(
        map(res => res.groups)
      )
  }

  askQuestion(text: string) {
    const answer$ = this.dialogService.open(AskQuestionComponent, { context: { title: text }, hasBackdrop: true });
    return answer$;
  }

  createMenu(selectedGroup: WordGroup, menuItems: GroupMenuItem[]): GroupMenuItem[] {

    if (this.isDefaultGroup(selectedGroup)) {
      const items = menuItems.filter(item => item.action === GroupAction.NEW_GROUP);
      return items;
    }

    return menuItems;

  }

  isDefaultGroup(selectedGroup: WordGroup): boolean {
    if(!selectedGroup) return
    return (selectedGroup._id === DefaultGroupId.ALL_WORDS || selectedGroup._id === DefaultGroupId.FAVORITES) ? true : false;

  }
}
