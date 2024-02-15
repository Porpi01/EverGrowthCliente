import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValoracionService } from './../../../service/Valoracion.service';
import { IProducto, IUsuario, IValoracion, IValoracionPage } from 'src/app/model/model.interfaces';
import { AdminValoracionDetailUnroutedComponent } from '../admin-valoracion-detail-unrouted/admin-valoracion-detail-unrouted.component';
import { UsuarioService } from 'src/app/service/Usuario.service';
import { ProductoService } from 'src/app/service/Producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-valoracion-plist-unrouted',
  templateUrl: './admin-valoracion-plist-unrouted.component.html',
  styleUrls: ['./admin-valoracion-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminValoracionPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_producto: number = 0;

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
    private UsuarioService: UsuarioService,
    private ProductoService: ProductoService,
    private MatSnackBar: MatSnackBar

  ) {

  }

  ngOnInit() {
    this.getPage();

    if (this.id_usuario > 0) {
      this.getUsuario();

    }
    if (this.id_producto > 0) {
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


  onInputChange(query: string): void {
    if (query.length > 2) {
      this.ValoracionService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_usuario, this.id_producto, query)
        .subscribe({
          next: (data: IValoracionPage) => {
            this.oPage = data;
            this.valoraciones = data.content;
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
    this.ValoracionService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_usuario,
        this.id_producto
      )
      .subscribe({
        next: (data: IValoracionPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.valoraciones = data.content;
          console.log(this.oPaginatorState);
          console.log(this.valoraciones);
          console.log(this.id_usuario)
          console.log(this.id_producto)
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
            this.MatSnackBar.open('La valoración ha sido eliminada', 'Cerrar', {
              duration: 2000,

            });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('La valoración no se ha podido eliminar', 'Cerrar', {
              duration: 2000,

            });
          }
        });
      },
      reject: () => {
        this.MatSnackBar.open('La valoración no ha sido eliminada', 'Cerrar', {
          duration: 2000,

        });
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
    this.ProductoService.getOne(this.id_producto).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}