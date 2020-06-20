import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralWordsRoutingModule } from './general-words-routing.module';
import { GeneralWordsComponent } from './general-words.component';


@NgModule({
  declarations: [GeneralWordsComponent],
  imports: [
    CommonModule,
    SharedModule,
    GeneralWordsRoutingModule
  ]
})
export class GeneralWordsModule { }
