import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPedidoPage, IPedido, IUsuario } from 'src/app/model/model.interfaces';
import { PedidoService } from '../../../service/Pedido.service';
import { AdminPedidoDetailUnroutedComponent } from '../admin-pedido-detail-unrouted/admin-pedido-detail-unrouted.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuarioService } from './../../../service/Usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PDFService } from './../../../service/PDF.service';


@Component({
  selector: 'app-admin-pedido-plist-unroutedç',
  templateUrl: './admin-pedido-plist-unrouted.component.html',
  styleUrls: ['./admin-pedido-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminPedidoPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;


  oPage: IPedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  pedidos: IPedido[] = [];
  pedidoToRemove: IPedido | null = null;
  ref: DynamicDialogRef | undefined;
  oUsuario: IUsuario | null = null;

  value: string = '';

  constructor(
    private PedidoService: PedidoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private UsuarioService: UsuarioService,
    private MatSnackBar: MatSnackBar,
    private PDFService : PDFService

  ) {
  }

  ngOnInit() {
    this.getPage();

    if (this.id_usuario > 0) {
      this.getUsuario();
      console.log(this.id_usuario);
      
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
    this.PedidoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_usuario,
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

  doView(pedido: IPedido) {
    this.ref = this.DialogService.open(AdminPedidoDetailUnroutedComponent, {
      data: {
        id: pedido.id
      },
      header: 'Vista de pedido',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  doRemove(pedido: IPedido) {
    this.pedidoToRemove = pedido;

    this.ConfirmationService.confirm({
      accept: () => {
        this.PedidoService.removeOne(this.pedidoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MatSnackBar.open('El pedido ha sido eliminado', 'Cerrar', { duration: 2000, });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 2000, });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open('Operación cancelada', 'Cerrar', { duration: 2000, });
      }
    });
  }

    //Añado esto
    imprimirFactura = (id_pedido: number) => {
      this.PDFService.imprimirFactura(id_pedido);
   
    }
  
    togglePedidoActive(pedido: IPedido): void {
      const pedidoToUpdate: IPedido = { ...pedido };
     
      pedidoToUpdate.active = !pedidoToUpdate.active;
  
      this.PedidoService.updateOne(pedidoToUpdate).subscribe({
        next: () => {
          this.forceReload.next(true);
        },
        error: (error) => {
          pedidoToUpdate.active = !pedidoToUpdate.active;
        }
      });
    }

  getUsuario(): void {
    this.UsuarioService.getOne(this.id_usuario).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;

        console.log(this.oUsuario.id);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }
}
