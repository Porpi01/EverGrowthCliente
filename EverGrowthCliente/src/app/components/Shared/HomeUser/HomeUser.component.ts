import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProducto, IProductoPage, IPedido, ICategoria, ICategoriaPage } from 'src/app/model/model.interfaces';
import { PedidoService } from 'src/app/service/Pedido.service';
import { ProductoService } from 'src/app/service/Producto.service';
import { SesionService } from './../../../service/Sesion.service';
import { CategoriaService } from './../../../service/Categoria.service';
import { AdminProductoDetailUnroutedComponent } from '../../Producto/admin-producto-detail-unrouted/admin-producto-detail-unrouted.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-HomeUser',
  templateUrl: './HomeUser.component.html',
  styleUrls: ['./HomeUser.component.css']
})
export class HomeUserComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_pedido: number = 0; //filter by user
  productosSeleccionados: IProducto[] = [];
  oPage: IProductoPage | undefined;
  oPedido: IPedido | null = null;
  orderField: string = "id";
  orderDirection: string = "asc";
  productos: IProducto[] = [];
  categoria: ICategoria[] = [];
  productosPorPagina: number = 8;
  oPaginatorState = { first: 0, rows: this.productosPorPagina, page: 0, pageCount: 0 };
  value: string = '';
  status: HttpErrorResponse | null = null;
  oProductoToRemove: IProducto | null = null;
  ref: DynamicDialogRef | undefined;
  strUserName: string = '';

  constructor(
    private productoService: ProductoService,
    public dialogService: DialogService,
 
    private pedidoService: PedidoService,
    private SesionService: SesionService,
    private CategoriaService: CategoriaService,
    private oRouter: Router,
  ) { }

  ngOnInit() {
    this.strUserName = this.SesionService.getUsername();
    this.getPage();
    this.getCategorias();
    if (this.id_pedido > 0) {
      this.getUser();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }


  onInputChange(query: string): void {
    if (query.length > 2) {
      this.productoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IProductoPage) => {
            this.oPage = data;
            this.productos = data.content;
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
    this.productoService
      .getPage(
        this.productosPorPagina,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content; 
          
          console.log(this.productos);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = this.productosPorPagina;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  getUser(): void {
    this.pedidoService.getOne(this.id_pedido).subscribe({
      next: (data: IPedido) => {
        this.oPedido = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  getCategorias(): void {
    this.CategoriaService.getPage(undefined, undefined, 'id', 'asc').subscribe({
      next: (data: ICategoriaPage) => {
        this.categoria = data.content;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener las categorías', error);
      }
    });
  }

  addToCart(producto: IProducto) {
    this.productosSeleccionados.push(producto);
    console.log(`Producto '${producto.nombre}' añadido al carrito.`);
  }

  getTotalAPagar(): number {
    const totalAPagar = this.productosSeleccionados.reduce((total, producto) => total + producto.precio, 0);
    return totalAPagar;
  }

  cargarPagina(direccion: number) {
    const nuevaPagina = this.oPaginatorState.page + direccion;
    if (nuevaPagina >= 0 && nuevaPagina < this.oPaginatorState.pageCount) {
      this.oPaginatorState.page = nuevaPagina;
      console.log(nuevaPagina);
      this.getPage();
    } else {
      if (nuevaPagina < 0) {
        this.oPaginatorState.page = 0;
      } else if (nuevaPagina >= this.oPaginatorState.pageCount) {
        this.oPaginatorState.page = this.oPaginatorState.pageCount - 1;
      }
    }
  }

  doView(producto: IProducto) {
    this.oRouter.navigate(['/user', 'producto', 'view', producto.id]);
  }

}



