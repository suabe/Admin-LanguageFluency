import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardImproverComponent } from './dashboard-improver.component';

describe('DashboardImproverComponent', () => {
  let component: DashboardImproverComponent;
  let fixture: ComponentFixture<DashboardImproverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardImproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardImproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
