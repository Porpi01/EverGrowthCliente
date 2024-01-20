import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';

import { ProductoService } from './../../../service/Producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProducto, IProductoPage } from 'src/app/model/model.interfaces';
@Component({
  selector: 'app-admin-producto-plist-unrouted',
  templateUrl: './admin-producto-plist-unrouted.component.html',
  styleUrls: ['./admin-producto-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminProductoPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: IProductoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  productos: IProducto[] = [];
  productoToRemove: IProducto | null = null;
  imagenBase64: string | null = null;
  value: string = '';

  constructor(
    private ProductoService: ProductoService,
    private ConfirmationService: ConfirmationService,
    private MatSnackBar: MatSnackBar
  ) { 
  }

  ngOnInit(): void {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      },
    });
    
  }



  onInputChange(query: string): void {
    if (query.length > 2) {
      this.ProductoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IProductoPage) => {
            this.oPage = data;
            this.productos = data.content;
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
    this.ProductoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content;
          console.log(this.oPaginatorState);
          console.log(this.productos);
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

  doRemove(producto: IProducto) {
    this.productoToRemove = producto;
    this.ConfirmationService.confirm({
      accept: () => {
        this.MatSnackBar.open("The producto has been removed.", '', { duration: 1200 });
        this.ProductoService.removeOne(this.productoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {

            this.status = error;
            this.MatSnackBar.open("The producto hasn't been removed.", "", { duration: 1200 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open("The producto hasn't been removed.", "", { duration: 1200 });
      }
    });
  }


}
