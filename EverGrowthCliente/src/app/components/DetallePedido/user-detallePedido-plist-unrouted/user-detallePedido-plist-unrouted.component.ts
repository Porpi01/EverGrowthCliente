import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IDetallePedidoPage, IDetallePedido, IPedido, IProducto } from 'src/app/model/model.interfaces';
import { AdminDetallePedidoDetailUnroutedComponent } from '../admin-detallePedido-detail-unrouted/admin-detallePedido-detail-unrouted.component';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';
import { ProductoService } from 'src/app/service/Producto.service';
import { PedidoService } from 'src/app/service/Pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-detallePedido-plist-unrouted',
  templateUrl: './user-detallePedido-plist-unrouted.component.html',
  styleUrls: ['./user-detallePedido-plist-unrouted.component.css']
})
export class UserDetallePedidoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_pedido: number = 0;
  @Input() id_producto: number = 0;
  

  oPage: IDetallePedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 20, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  detallePedidos: IDetallePedido[] = [];
  pedidoToRemove: IDetallePedido | null = null;
  ref: DynamicDialogRef | undefined;
  oPedido: IPedido | null = null;
  oProducto:IProducto | null = null;
 
  value: string = '';

  constructor(
    private DetallePedidoService: DetallePedidoService,
    private ProductoService: ProductoService,
    private PedidoService: PedidoService,
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
