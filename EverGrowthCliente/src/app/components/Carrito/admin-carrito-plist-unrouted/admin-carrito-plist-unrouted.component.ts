import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { ICarrito, ICarritoPage, IProducto, IUsuario } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCarritoDetailUnroutedComponent } from '../admin-carrito-detail-unrouted/admin-carrito-detail-unrouted.component';
import { UsuarioService } from './../../../service/Usuario.service';
import { ProductoService } from './../../../service/Producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-carrito-plist-unrouted',
  templateUrl: './admin-carrito-plist-unrouted.component.html',
  styleUrls: ['./admin-carrito-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminCarritoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_producto: number = 0;

  oPage: ICarritoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  carrito: ICarrito[] = [];
  carritoToRemove: ICarrito | null = null;
  ref: DynamicDialogRef | undefined;
  oUsuario: IUsuario | null = null;
  oProducto: IProducto | null = null;
 
  value: string = '';

  constructor(
    private CarritoService: CarritoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private UsuarioService: UsuarioService,
    private ProductoService: ProductoService,
    private MatSnackBar : MatSnackBar
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




  getPage(): void {
    this.CarritoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_producto,
        this.id_usuario,
      )
      .subscribe({
        next: (data: ICarritoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.carrito = data.content;
         
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

 
  doRemove(carrito: ICarrito) {
    this.carritoToRemove  = carrito;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.CarritoService.removeOne(this.carritoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MatSnackBar.open('El carrito ha sido eliminado', 'Cerrar', { duration: 2000, panelClass: ['success-snackbar'] });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El carrito no ha sido eliminado', 'Cerrar', { duration: 2000, panelClass: ['error-snackbar'] });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open('El carrito no ha sido eliminado', 'Cerrar', { duration: 2000, panelClass: ['info-snackbar'] });
      }
    });
  }

  getUsuario(): void {
    this.UsuarioService.getOne(this.id_usuario).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;

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
