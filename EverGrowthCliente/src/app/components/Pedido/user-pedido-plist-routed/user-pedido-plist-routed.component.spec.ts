/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserPedidoPlistRoutedComponent } from './user-pedido-plist-routed.component';

describe('UserPedidoPlistRoutedComponent', () => {
  let component: UserPedidoPlistRoutedComponent;
  let fixture: ComponentFixture<UserPedidoPlistRoutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPedidoPlistRoutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPedidoPlistRoutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
