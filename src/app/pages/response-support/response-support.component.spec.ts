import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseSupportComponent } from './response-support.component';

describe('ResponseSupportComponent', () => {
  let component: ResponseSupportComponent;
  let fixture: ComponentFixture<ResponseSupportComponent>;

  beforeEach(async(() => {
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
