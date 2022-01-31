import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobrosComponent } from './cobros.component';

describe('CobrosComponent', () => {
  let component: CobrosComponent;
  let fixture: ComponentFixture<CobrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
