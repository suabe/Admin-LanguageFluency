import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosRechazadosComponent } from './cobros-rechazados.component';

describe('CobrosRechazadosComponent', () => {
  let component: CobrosRechazadosComponent;
  let fixture: ComponentFixture<CobrosRechazadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosRechazadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosRechazadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
