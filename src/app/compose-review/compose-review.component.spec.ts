import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeReviewComponent } from './compose-review.component';

describe('ComposeReviewComponent', () => {
  let component: ComposeReviewComponent;
  let fixture: ComponentFixture<ComposeReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposeReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
