/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminPedidoPlistUnroutedçComponent } from './admin-pedido-plist-unroutedç.component';

describe('AdminPedidoPlistUnroutedçComponent', () => {
  let component: AdminPedidoPlistUnroutedçComponent;
  let fixture: ComponentFixture<AdminPedidoPlistUnroutedçComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPedidoPlistUnroutedçComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPedidoPlistUnroutedçComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
