/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminDetallePedidoPlistRoutedComponent } from './admin-detallePedido-plist-routed.component';

describe('AdminDetallePedidoPlistRoutedComponent', () => {
  let component: AdminDetallePedidoPlistRoutedComponent;
  let fixture: ComponentFixture<AdminDetallePedidoPlistRoutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetallePedidoPlistRoutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetallePedidoPlistRoutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
