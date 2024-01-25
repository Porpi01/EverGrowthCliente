/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminDetallePedidoEditRoutedComponent } from './admin-detallePedido-edit-routed.component';

describe('AdminDetallePedidoEditRoutedComponent', () => {
  let component: AdminDetallePedidoEditRoutedComponent;
  let fixture: ComponentFixture<AdminDetallePedidoEditRoutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetallePedidoEditRoutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetallePedidoEditRoutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
