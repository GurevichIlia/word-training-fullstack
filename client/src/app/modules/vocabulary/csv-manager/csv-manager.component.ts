import { AppStateInterface } from './../../../store/reducers';
import { select, Store } from '@ngrx/store';
import { CsvHandlerService } from './../../../core/services/csv-handler.service';
import { NbDialogService } from '@nebular/theme';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, finalize, tap } from 'rxjs/operators';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { addWordsFromCsvAction, addWordsFromCsvErrorAction } from 'src/app/store/actions/words.actions';
import { csvLoaderSelector, isCloseCsvHandlerSelector, isResetCsvHandlerSelector } from 'src/app/store/selectors/words.selectors';

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
  isLoading$: Observable<boolean>;
  isCloseCsvHandler$: Observable<boolean>
  isResetCsvHandlerState$: Observable<boolean>
  words$: Observable<Word[]>;
  selectedFile: File;
  @Output() updateWordList = new EventEmitter();
  constructor(
    private dialog: NbDialogService,
    private store$: Store<AppStateInterface>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store$.pipe(select(csvLoaderSelector));
    this.isCloseCsvHandler$ = this.store$.pipe(
      select(isCloseCsvHandlerSelector),
    )

    this.isResetCsvHandlerState$ = this.store$.pipe(
      select(isResetCsvHandlerSelector),
      tap((isReset: boolean) => isReset ? this.resetState() : null)
    )
  }

  onUpload(file: File) {

    // this.words$ = this.csvHandler.addNewWordsFromCSV(file, this.selectedGroup._id)
    //   .pipe(
    //     finalize(() => this.isLoading = false),
    //     tap(res => console.log(res)),
    //     tap(res => this.resetState())
    //   );

    this.store$.dispatch(addWordsFromCsvAction({ file, selectedGroupId: this.selectedGroup._id }))
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
