import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBannerComponent } from './add-banner.component';

describe('AddBannerComponent', () => {
  let component: AddBannerComponent;
  let fixture: ComponentFixture<AddBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
