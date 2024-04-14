/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserPedidoPlistUnroutedComponent } from './user-pedido-plist-unrouted.component';

describe('UserPedidoPlistUnroutedComponent', () => {
  let component: UserPedidoPlistUnroutedComponent;
  let fixture: ComponentFixture<UserPedidoPlistUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPedidoPlistUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPedidoPlistUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
