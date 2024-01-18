/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminDetallePedidoPlistUnroutedComponent } from './admin-detallePedido-plist-unrouted.component';

describe('AdminDetallePedidoPlistUnroutedComponent', () => {
  let component: AdminDetallePedidoPlistUnroutedComponent;
  let fixture: ComponentFixture<AdminDetallePedidoPlistUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetallePedidoPlistUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetallePedidoPlistUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
