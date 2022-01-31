import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardSpeakerComponent } from './dashboard-speaker.component';

describe('DashboardSpeakerComponent', () => {
  let component: DashboardSpeakerComponent;
  let fixture: ComponentFixture<DashboardSpeakerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSpeakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
