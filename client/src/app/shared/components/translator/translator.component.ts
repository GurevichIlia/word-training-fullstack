import { SupportedLanguage, TranslationConfig, TranslationService } from './../../../core/services/translation.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AbstractControl, FormBuilder, } from '@angular/forms';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})
export class TranslatorComponent implements OnInit, OnDestroy {
  translationForm = this.fb.group({
    textLang: [''],
    translationLang: [''],
    text: [''],
    translation: ['']
  })
  unsubscribe$ = new Subject()
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
  }
  get text(): AbstractControl {
    return this.translationForm.get('text')
  }

  get translation(): AbstractControl {
    return this.translationForm.get('translation')
  }

  get textLang(): AbstractControl {
    return this.translationForm.get('textLang')
  }

  get translationLang(): AbstractControl {
    return this.translationForm.get('translationLang')
  }

  get supportedLanguagesForTranslation$(): Observable<SupportedLanguage[]> {
    return this.translationService.supportedLanguages$
  }

  translateText(): void {
    if (!this.text.value || !this.translationLang.value) return

    const config: TranslationConfig = {
      text: this.text.value,
      langFrom: this.textLang.value,
      langTo: this.translationLang.value

    }


    this.translationService.getTranslation(config)
      .pipe(
        tap(res => {
          if (res && res.text) {
            this.translation.patchValue(res.text)
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe()
  }

  swapLanguages(): void {
    const textLang = this.textLang.value
    const translationLang = this.translationLang.value

    this.textLang.patchValue(translationLang)
    this.translationLang.patchValue(textLang)
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
