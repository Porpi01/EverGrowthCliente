import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICarrito, ICarritoPage } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCarritoDetailUnroutedComponent } from '../admin-carrito-detail-unrouted/admin-carrito-detail-unrouted.component';


@Component({
  selector: 'app-admin-carrito-plist-unrouted',
  templateUrl: './admin-carrito-plist-unrouted.component.html',
  styleUrls: ['./admin-carrito-plist-unrouted.component.css'],
  providers: [ConfirmationService,MessageService]
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
  ref: DynamicDialogRef | undefined;
 
  value: string = '';

  constructor(
    private CarritoService: CarritoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MessageService: MessageService
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

 
  doView(carrito: ICarrito) {
    this.ref = this.DialogService.open(AdminCarritoDetailUnroutedComponent, {
      data: {
        id: carrito.id
      },
      header: 'Vista de carrito',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  doRemove(carrito: ICarrito) {
    this.carritoToRemove  = carrito;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.CarritoService.removeOne(this.carritoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'El carrito ha sido eliminado' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'El carrito no ha sido eliminado' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'El carrito no ha sido eliminado' });
      }
    });
  }


}
