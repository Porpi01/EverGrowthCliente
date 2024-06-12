import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IUsuarioPage, IUsuario } from 'src/app/model/model.interfaces';
import { UsuarioService } from './../../../service/Usuario.service';


@Component({
  selector: 'app-admin-user-selection-unrouted',
  templateUrl: './admin-user-selection-unrouted.component.html',
  styleUrls: ['./admin-user-selection-unrouted.component.css']
})
export class AdminUserSelectionUnroutedComponent implements OnInit {
  
  oPage: IUsuarioPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuarios: IUsuario[] = [];
  userToRemove: IUsuario | null = null;
  ref: DynamicDialogRef | undefined;
  filteredUsers: IUsuario[] | undefined;
  selectedUsers: IUsuario | undefined;
  formGroup: FormGroup;
  value: string = '';

  constructor(
    private usuarioService: UsuarioService,
    public oDynamicDialogRef: DynamicDialogRef
  ) {
    this.formGroup = new FormGroup({
      selectedUser: new FormControl<any | null>(null)
    });
  }

  ngOnInit() {
    this.getPage();
  }

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.oPaginatorState.page = 0; // Reinicia la página a 0 al aplicar un filtro
      this.usuarioService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IUsuarioPage) => {
            this.oPage = data;
            this.usuarios = data.content;
            this.oPaginatorState.pageCount = data.totalPages;
            console.log(this.oPaginatorState);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          }
        });
    } else {
      this.getPage();
    }
  }

  getPage(): void {
    this.usuarioService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IUsuarioPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.usuarios = data.content;
          console.log(this.oPaginatorState);
          console.log(this.usuarios);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  onSelectUser(oUser: IUsuario) {
    this.oDynamicDialogRef.close(oUser);
  }
}
