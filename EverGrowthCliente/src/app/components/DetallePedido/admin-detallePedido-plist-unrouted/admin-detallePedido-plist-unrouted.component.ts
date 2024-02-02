import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';
import { IDetallePedido, IDetallePedidoPage, IPedido, IPedidoPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminDetallePedidoDetailUnroutedComponent } from '../admin-detallePedido-detail-unrouted/admin-detallePedido-detail-unrouted.component';

@Component({
  selector: 'app-admin-detallePedido-plist-unrouted',
  templateUrl: './admin-detallePedido-plist-unrouted.component.html',
  styleUrls: ['./admin-detallePedido-plist-unrouted.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AdminDetallePedidoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: IDetallePedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  detallePedidos: IDetallePedido[] = [];
  pedidoToRemove: IDetallePedido | null = null;
  ref: DynamicDialogRef | undefined;
 
  value: string = '';

  constructor(
    private DetallePedidoService: DetallePedidoService,
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
    this.DetallePedidoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IDetallePedidoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.detallePedidos = data.content;
          console.log(this.oPaginatorState);
          console.log(this.detallePedidos);
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

 
  doView(detallePedido: IDetallePedido) {
    this.ref = this.DialogService.open(AdminDetallePedidoDetailUnroutedComponent, {
      data: {
        id: detallePedido.id
      },
      header: 'Ver DetallePedido',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  doRemove(detallePedido: IDetallePedido) {
    this.pedidoToRemove  = detallePedido;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.DetallePedidoService.removeOne(this.pedidoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'El Detalle Pedido se ha eliminado' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'El Detalle Pedido no se ha eliminado' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'El Detalle Pedido no se ha eliminado' });
      }
    });
  }

  calculateTotalPrice(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }
}

