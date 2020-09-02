import { finalize, tap } from 'rxjs/operators';
import { VocabularyFacade } from './../vocabulary.facade';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Word } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-csv-manager',
  templateUrl: './csv-manager.component.html',
  styleUrls: ['./csv-manager.component.scss'],
})
export class CsvManagerComponent implements OnInit {
  @Input() expanded = false;
  file = new EventEmitter<File>();
  isLoading = false;
  words$: Observable<Word[]>;
  selectedFile
  @Output() updateWordList = new EventEmitter();
  constructor(private vocabularyFacade: VocabularyFacade) { }

  ngOnInit() {
  }

  onUpload(file: File) {
    this.isLoading = true;
    this.words$ = this.vocabularyFacade.addNewWordsFromCSV(file)
      .pipe(
        finalize(() => this.isLoading = false),
        tap(res => console.log(res)),
        tap(res => this.resetState())
      );
  }

  showFile(file: File) {
    if (!file) return

    this.selectedFile = file;
  }

  resetState() {
    this.selectedFile = null;
    this.updateWordList.emit()
  }
}
