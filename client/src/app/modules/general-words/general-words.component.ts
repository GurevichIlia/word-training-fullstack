import { Component, OnInit } from '@angular/core';
import { GeneralWordsFacade } from './general-words.facade';

@Component({
  selector: 'app-general-words',
  templateUrl: './general-words.component.html',
  styleUrls: ['./general-words.component.scss']
})
export class GeneralWordsComponent implements OnInit {
  generalWords$ = this.generalWordsFacade.getGeneralWords()
  constructor(private generalWordsFacade: GeneralWordsFacade) { }

  ngOnInit() {


  }

}
