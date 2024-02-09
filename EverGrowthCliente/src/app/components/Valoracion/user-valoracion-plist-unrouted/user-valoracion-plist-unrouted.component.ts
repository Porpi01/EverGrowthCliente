import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IValoracionPage, IValoracion, IUsuario, IProducto } from 'src/app/model/model.interfaces';
import { AdminValoracionDetailUnroutedComponent } from '../admin-valoracion-detail-unrouted/admin-valoracion-detail-unrouted.component';
import { ValoracionService } from './../../../service/Valoracion.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from './../../../service/Usuario.service';
import { ProductoService } from './../../../service/Producto.service';

@Component({
  selector: 'app-user-valoracion-plist-unrouted',
  templateUrl: './user-valoracion-plist-unrouted.component.html',
  styleUrls: ['./user-valoracion-plist-unrouted.component.css']
})
export class UserValoracionPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();


  @Input() id_usuario: number = 0;
  @Input() id: number= 0;

  oPage: IValoracionPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];
  valoracionToRemove: IValoracion | null = null;
  ref: DynamicDialogRef | undefined;
  oUsuario: IUsuario | null = null;
  oProducto: IProducto | null = null;

  value: string = '';

  constructor(
    private ValoracionService: ValoracionService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MessageService: MessageService,
    private UsuarioService: UsuarioService,
    private ProductoService: ProductoService,



  ) {

  }

  ngOnInit() {
    this.getPage();

 
    if (this.id_usuario > 0) {
      this.getUsuario();
      
    }
    if (this.id > 0) {
      this.getProducto();
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
    this.ValoracionService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_usuario, 
        this.id
      
      )
      .subscribe({
        next: (data: IValoracionPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.valoraciones = data.content;
          console.log(this.oPaginatorState);
          console.log(this.valoraciones);
         
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

  doView(valoracion: IValoracion) {
    this.ref = this.DialogService.open(AdminValoracionDetailUnroutedComponent, {
      data: {
        id: valoracion.id,
        openedFromView: true,

      },
      header: 'Vista de la valoración',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });

  }


  doRemove(valoracion: IValoracion) {
    this.valoracionToRemove = valoracion;

    this.ConfirmationService.confirm({
      accept: () => {
        this.ValoracionService.removeOne(this.valoracionToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'La valoración ha sido eliminada' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La valoración no se ha podido eliminar' });
          }
        });
      },
      reject: () => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'La valoración no ha sido eliminada' });
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

  getProducto(): void {
    this.ProductoService.getOne(this.id).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}