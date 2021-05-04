import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCardBodyComponent } from './word-card-body.component';

describe('WordCardBodyComponent', () => {
  let component: WordCardBodyComponent;
  let fixture: ComponentFixture<WordCardBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordCardBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
