import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImproverComponent } from './improver.component';

describe('ImproverComponent', () => {
  let component: ImproverComponent;
  let fixture: ComponentFixture<ImproverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
