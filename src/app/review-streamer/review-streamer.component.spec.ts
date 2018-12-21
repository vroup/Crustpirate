import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStreamerComponent } from './review-streamer.component';

describe('ReviewStreamerComponent', () => {
  let component: ReviewStreamerComponent;
  let fixture: ComponentFixture<ReviewStreamerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewStreamerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewStreamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
