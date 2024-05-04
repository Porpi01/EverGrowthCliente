import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';
import { IDetallePedido, IDetallePedidoPage, IPedido, IPedidoPage, IProducto } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminDetallePedidoDetailUnroutedComponent } from '../admin-detallePedido-detail-unrouted/admin-detallePedido-detail-unrouted.component';
import { ProductoService } from './../../../service/Producto.service';
import { PedidoService } from 'src/app/service/Pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-detallePedido-plist-unrouted',
  templateUrl: './admin-detallePedido-plist-unrouted.component.html',
  styleUrls: ['./admin-detallePedido-plist-unrouted.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AdminDetallePedidoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_pedido: number = 0;
  @Input() id_producto: number = 0;
  

  oPage: IDetallePedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  detallePedidos: IDetallePedido[] = [];
  pedidoToRemove: IDetallePedido | null = null;
  ref: DynamicDialogRef | undefined;
  oPedido: IPedido | null = null;
  oProducto:IProducto | null = null;
 
  value: string = '';

  constructor(
    private DetallePedidoService: DetallePedidoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MessageService: MessageService,
    private ProductoService: ProductoService,
    private PedidoService: PedidoService,
    private MatSnackBar : MatSnackBar
  ) { 
  }

  ngOnInit() {
    this.getPage();

    if (this.id_pedido > 0) {
      this.getPedido();
      console.log(this.id_pedido);
      
    }
    if (this.id_producto > 0) {
      this.getProducto();
      console.log(this.id_producto);
      
    }

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
        this.orderDirection,
        this.id_pedido,
        this.id_producto,
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



  doRemove(detallePedido: IDetallePedido) {
    this.pedidoToRemove  = detallePedido;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.DetallePedidoService.removeOne(this.pedidoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MatSnackBar.open('El Detalle Pedido se ha eliminado', 'Cerrar', { duration: 2000 });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El Detalle Pedido no se ha eliminado', 'Cerrar', { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open('El Detalle Pedido no se ha eliminado', 'Cerrar', { duration: 2000 });
      }
    });
  }

  calculateTotalPrice(detallePedido: IDetallePedido, quantity: number, unitPrice: number): string {
    const totalPrice = quantity * unitPrice;
    const totalWithIVA = totalPrice + (totalPrice * detallePedido.iva);
    return totalWithIVA.toFixed(2);
}

  getProducto(): void {
    this.ProductoService.getOne(this.id_producto).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

  getPedido(): void {
    this.PedidoService.getOne(this.id_pedido).subscribe({
      next: (data: IPedido) => {
        this.oPedido = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }
}

