import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbTableRowComponent } from './verb-table-row.component';

describe('VerbTableRowComponent', () => {
  let component: VerbTableRowComponent;
  let fixture: ComponentFixture<VerbTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
