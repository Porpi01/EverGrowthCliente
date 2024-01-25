/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminDetallePedidoFormUnroutedComponent } from './admin-detallePedido-form-unrouted.component';

describe('AdminDetallePedidoFormUnroutedComponent', () => {
  let component: AdminDetallePedidoFormUnroutedComponent;
  let fixture: ComponentFixture<AdminDetallePedidoFormUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetallePedidoFormUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetallePedidoFormUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
