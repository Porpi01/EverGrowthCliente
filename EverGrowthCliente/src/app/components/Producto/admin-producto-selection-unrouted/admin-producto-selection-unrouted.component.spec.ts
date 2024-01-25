/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminProductoSelectionUnroutedComponent } from './admin-producto-selection-unrouted.component';

describe('AdminProductoSelectionUnroutedComponent', () => {
  let component: AdminProductoSelectionUnroutedComponent;
  let fixture: ComponentFixture<AdminProductoSelectionUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductoSelectionUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductoSelectionUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
