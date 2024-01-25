/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminDetallePedidoNewRoutedComponent } from './admin-detallePedido-new-routed.component';

describe('AdminDetallePedidoNewRoutedComponent', () => {
  let component: AdminDetallePedidoNewRoutedComponent;
  let fixture: ComponentFixture<AdminDetallePedidoNewRoutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetallePedidoNewRoutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetallePedidoNewRoutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
