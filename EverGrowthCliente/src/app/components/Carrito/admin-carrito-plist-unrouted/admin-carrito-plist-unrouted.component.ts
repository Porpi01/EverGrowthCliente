import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICarrito, ICarritoPage } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';

@Component({
  selector: 'app-admin-carrito-plist-unrouted',
  templateUrl: './admin-carrito-plist-unrouted.component.html',
  styleUrls: ['./admin-carrito-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminCarritoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: ICarritoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  carrito: ICarrito[] = [];
  carritoToRemove: ICarrito | null = null;
 
  value: string = '';

  constructor(
    private CarritoService: CarritoService,
    private ConfirmationService: ConfirmationService,
    private MatSnackBar: MatSnackBar
  ) { 
  }

  ngOnInit() {
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
      this.CarritoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: ICarritoPage) => {
            this.oPage = data;
            this.carrito = data.content;
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
    this.CarritoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: ICarritoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.carrito = data.content;
          console.log(this.oPaginatorState);
          console.log(this.carrito);
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

  doRemove(producto: ICarrito) {
    this.carritoToRemove = producto;
    this.ConfirmationService.confirm({
      accept: () => {
        this.MatSnackBar.open("The producto has been removed.", '', { duration: 1200 });
        this.CarritoService.removeOne(this.carritoToRemove?.id).subscribe({
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
