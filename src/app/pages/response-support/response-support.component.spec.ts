import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResponseSupportComponent } from './response-support.component';

describe('ResponseSupportComponent', () => {
  let component: ResponseSupportComponent;
  let fixture: ComponentFixture<ResponseSupportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
