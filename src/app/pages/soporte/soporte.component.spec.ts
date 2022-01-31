import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoporteComponent } from './soporte.component';

describe('SoporteComponent', () => {
  let component: SoporteComponent;
  let fixture: ComponentFixture<SoporteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
