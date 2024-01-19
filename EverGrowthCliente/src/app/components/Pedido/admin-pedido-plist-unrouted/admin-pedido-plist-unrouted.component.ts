import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPedidoPage, IPedido } from 'src/app/model/model.interfaces';
import { PedidoService } from '../../../service/Pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-pedido-plist-unroutedç',
  templateUrl: './admin-pedido-plist-unrouted.component.html',
  styleUrls: ['./admin-pedido-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminPedidoPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: IPedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  pedidos: IPedido[] = [];
  pedidoToRemove: IPedido | null = null;
 
  value: string = '';

  constructor(
    private PedidoService: PedidoService,
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
      this.PedidoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IPedidoPage) => {
            this.oPage = data;
            this.pedidos = data.content;
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
    this.PedidoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IPedidoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.pedidos = data.content;
          console.log(this.oPaginatorState);
          console.log(this.pedidos);
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

  doRemove(producto: IPedido) {
    this.pedidoToRemove = producto;
    this.ConfirmationService.confirm({
      accept: () => {
        this.MatSnackBar.open("The producto has been removed.", '', { duration: 1200 });
        this.PedidoService.removeOne(this.pedidoToRemove?.id).subscribe({
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
