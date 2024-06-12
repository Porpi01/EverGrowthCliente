import { Component, OnInit } from '@angular/core';
import { ICategoria, ICategoriaPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { CategoriaService } from './../../../service/Categoria.service';


@Component({
  selector: 'app-admin-categoria-selection-unrouted',
  templateUrl: './admin-categoria-selection-unrouted.component.html',
  styleUrls: ['./admin-categoria-selection-unrouted.component.css']
})
export class AdminCategoriaSelectionUnroutedComponent implements OnInit {

  oPage: ICategoriaPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  categorias: ICategoria[] = [];
  userToRemove: ICategoria | null = null;
  ref: DynamicDialogRef | undefined;
  filteredUsers: ICategoria[] | undefined;
  selectedUsers: ICategoria | undefined;
  formGroup: FormGroup;
  value: string = '';

  constructor(
    private CategoriaService: CategoriaService,
    private dialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) {
    this.formGroup = new FormGroup({
      selectedCategoria: new FormControl<any | null>(null)
    });
  }

  ngOnInit() {
    this.getPage();
  }

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.oPaginatorState.page = 0; // Reinicia la página a 0 al aplicar un filtro

      this.CategoriaService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: ICategoriaPage) => {
            this.oPage = data;
            this.categorias = data.content;
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
    this.CategoriaService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: ICategoriaPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.categorias = data.content;
          console.log(this.oPaginatorState);
          console.log(this.categorias);
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

  onSelectCategoria(categoria: ICategoria) {
    this.oDynamicDialogRef.close(categoria);
  }

}
