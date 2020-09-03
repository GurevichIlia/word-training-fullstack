import { NbDialogService } from '@nebular/theme';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { VocabularyFacade } from './../vocabulary.facade';

@Component({
  selector: 'app-csv-manager',
  templateUrl: './csv-manager.component.html',
  styleUrls: ['./csv-manager.component.scss'],
})
export class CsvManagerComponent implements OnInit {
  @ViewChild('instruction') insctructionModal: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  @Input() expanded = false;
  @Input() selectedGroup: WordGroup;

  file = new EventEmitter<File>();
  isLoading = false;
  words$: Observable<Word[]>;
  selectedFile;
  @Output() updateWordList = new EventEmitter();
  constructor(
    private vocabularyFacade: VocabularyFacade,
    private dialog: NbDialogService
  ) { }

  ngOnInit() {
  }

  onUpload(file: File) {
    this.isLoading = true;
    this.words$ = this.vocabularyFacade.addNewWordsFromCSV(file, this.selectedGroup._id)
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

  showInstruction() {
    this.dialog.open(this.insctructionModal)
  }

  resetState() {
    this.selectedFile = null;
    this.updateWordList.emit();
    this.fileInput.nativeElement.value = '';
  }
}
