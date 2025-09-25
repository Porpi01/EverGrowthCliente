import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IProducto, IProductoPage } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';

@Component({
  selector: 'app-admin-producto-selection-unrouted',
  templateUrl: './admin-producto-selection-unrouted.component.html',
  styleUrls: ['./admin-producto-selection-unrouted.component.css']
})
export class AdminProductoSelectionUnroutedComponent implements OnInit {

  @Input() id_categoria: number = 0;


  oPage: IProductoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  productos: IProducto[] = [];
  produtoToRemove: IProducto | null = null;
  ref: DynamicDialogRef | undefined;
  filteredUsers: IProducto[] | undefined;
  selectedUsers: IProducto | undefined;
  formGroup: FormGroup;
  value: string = '';
  url?: string;


  constructor(
    private ProductoService: ProductoService,
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
      this.ProductoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_categoria, query)
        .subscribe({
          next: (data: IProductoPage) => {
            this.oPage = data;
            this.productos = data.content;
            this.oPaginatorState.pageCount = data.totalPages;
        
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
    this.ProductoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_categoria
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content.filter((producto: IProducto) => producto.stock > 0);
          
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

  onSelectProducto(categoria: IProducto) {
    this.oDynamicDialogRef.close(categoria);
  }

}
