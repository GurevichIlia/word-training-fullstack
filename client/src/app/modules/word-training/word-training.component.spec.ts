import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTrainingComponent } from './word-training.component';

describe('WordTrainingComponent', () => {
  let component: WordTrainingComponent;
  let fixture: ComponentFixture<WordTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
