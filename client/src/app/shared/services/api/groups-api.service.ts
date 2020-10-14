import { ApiService } from './../../../core/services/api.service';
import { Injectable } from '@angular/core';
import { Language, WordGroup, Word } from '../../interfaces';
import { BASE_URL } from './api-languages.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsApiService {

  constructor(private http: ApiService) {

  }

  saveGroup(name: string, language: Language, id: string = '') {
    const languageId = language._id;
    return this.http.post<WordGroup>(`${BASE_URL}/api/word-group/create`, { group: { name, languageId, id } });
  }

  deleteWordGroup(groupId: string) {
    return this.http.post<Word>(`${BASE_URL}/api/word-group/deleteGroup`, { groupId });

  }

  assignGroup(groupId: string, selectedWords: string[]) {
    return this.http.post<Word>(`${BASE_URL}/api/word-group/assign-group`, { groupId, selectedWords });
  }

  getAllWordsGroups(language: Language) {
    return this.http.get<WordGroup[]>(`${BASE_URL}/api/word-group/getAllGroups?languageId=${language._id}`);
  }
}
