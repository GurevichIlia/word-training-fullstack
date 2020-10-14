import { GeneralFacade } from './../../general.facade';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { GroupMenuItem, MenuItem } from 'src/app/core';
import { WordGroup } from 'src/app/shared/interfaces';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { GroupsApiService } from 'src/app/shared/services/api/groups-api.service';
import { GroupAction, GroupType } from '../enums';
import { GeneralState } from './../../general.state';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(
    private generalState: GeneralState,
    private groupsApi: GroupsApiService,
    private dialogService: NbDialogService,
    private generalFacade: GeneralFacade
  ) { }

  // getWordsGroups$(): Observable<WordGroup[]> {
  //   return this.generalState.getWordsGroups$();
  // }
  getWordsGroups$(): Observable<WordGroup[]> {
    if (!this.generalState.getWordsGroups$()) {
      return this.generalFacade.getCurrentLearningLanguage$()
        .pipe(
          switchMap(lang => {
            this.generalState.setWordsGroups(this.groupsApi.getAllWordsGroups(lang).pipe(shareReplay()));
            return this.generalState.getWordsGroups$();
          })
        )
    }

    return this.generalState.getWordsGroups$();
  }




  saveGroup(name: string, selectedGroup: WordGroup) {
    // const language = this.generalState.getCurrentLearningLanguage$();
    const groupId = selectedGroup ? selectedGroup._id : '';
    return this.generalState.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.groupsApi.saveGroup(name, language, groupId)
        ));
  }

  deleteWordGroup(group: WordGroup) {
    const title = `Would you like to remove group ${group.name} ?`;
    const result$ = this.askQuestion(title);

    return result$.onClose.pipe(
      switchMap(res => {
        if (res) {
          // this.vocabularyFacade.deleteWord(word);
          return this.groupsApi.deleteWordGroup(group._id);
        } else {
          return EMPTY;
        }
      }),
    );

  }

  askQuestion(text: string) {
    const answer$ = this.dialogService.open(AskQuestionComponent, { context: { title: text }, hasBackdrop: true });
    return answer$;
  }

  createMenu(selectedGroup$: Observable<WordGroup>, menuItems: GroupMenuItem[]): Observable<GroupMenuItem[]> {

    return selectedGroup$.pipe(
      map(selectedGroup => {


        if (this.isBaseGroup(selectedGroup)) {
          const items = menuItems.filter(item => item.action === GroupAction.NEW_GROUP);
          return items;
        }

        return menuItems;
      })
    )

  }

  isBaseGroup(selectedGroup: WordGroup): boolean {
    return (selectedGroup._id === GroupType.ALL_WORDS || selectedGroup._id === GroupType.FAVORITES) ? true : false;

  }
}
