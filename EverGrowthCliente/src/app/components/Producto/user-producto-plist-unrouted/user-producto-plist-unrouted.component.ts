import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IProducto, IProductoPage, ICategoria, ICategoriaPage, ICarrito, IUsuario } from 'src/app/model/model.interfaces';
import { ProductoService } from 'src/app/service/Producto.service';
import { SesionService } from 'src/app/service/Sesion.service';
import { CategoriaService } from './../../../service/Categoria.service';
import { CarritoService } from './../../../service/Carrito.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-producto-plist-unrouted',
  templateUrl: './user-producto-plist-unrouted.component.html',
  styleUrls: ['./user-producto-plist-unrouted.component.css']
})
export class UserProductoPlistUnroutedComponent implements OnInit {


  @Input() id_categoria: number = 0; // Filtro por categoría
  id_producto: number = 0;
  id_usuario: number = 0;
  productosSeleccionados: IProducto[] = [];
  oPage: IProductoPage | undefined;
  productos: IProducto[] = [];

  categoria: ICategoria[] = [];
  productosPorPagina: number = 8;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState = { first: 0, rows: this.productosPorPagina, page: 0, pageCount: 0 };
  value: string = '';
  status: HttpErrorResponse | null = null;
  oProductoToRemove: IProducto | null = null;
  ref: DynamicDialogRef | undefined;
  oCategoria: ICategoria | null = null;
  strUserName: string = '';
  idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;

  carrito: ICarrito = { user: {}, producto: {}, cantidad: 0 } as ICarrito;



  constructor(
    private productoService: ProductoService,
    private sesionService: SesionService,
    private CategoriaService: CategoriaService,
    private oRouter: Router,
    private CarritoService: CarritoService,

    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.strUserName = this.sesionService.getUsername();
    this.getPage();
    this.getCategorias();
    if (this.id_categoria > 0) {
      this.getCategoria();
    }

  }



 onInputChange(query: string): void {
  console.log('Query actual:', query);

  if (query.length > 2) {
    console.log('Query > 2, buscando productos filtrados');
    this.oPaginatorState.page = 0; // reinicia paginación

    this.productoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_categoria,
        query
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.productos = data.content;
          this.oPaginatorState.pageCount = data.totalPages;
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      });
  } else if (query.length === 0) {
    this.getPage(); // solo recarga todo si el input está completamente vacío
  } else {
    // No hacer nada, mantiene la lista actual hasta que el usuario borre todo
  }
}

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = this.productosPorPagina;
    this.getPage();
  }

  getPage(): void {
    this.productoService
      .getPage(
        this.productosPorPagina,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_categoria
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content;
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
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

  getCategoria(): void {
    this.CategoriaService.getOne(this.id_categoria).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  getCategorias(): void {
    this.CategoriaService.getPage(13, 0, 'id', 'asc').subscribe({
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
  }

  getTotalAPagar(): number {
    const totalAPagar = this.productosSeleccionados.reduce((total, producto) => total + producto.precio, 0);
    return totalAPagar;
  }

  cargarPagina(direccion: number) {
    const nuevaPagina = this.oPaginatorState.page + direccion;
    if (nuevaPagina >= 0 && nuevaPagina < this.oPaginatorState.pageCount) {
      this.oPaginatorState.page = nuevaPagina;
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

  filtrarPorCategoria(idCategoria: number): void {
    this.id_categoria = idCategoria;
    this.oPaginatorState.page = 0; // Reinicia la página a 0 al aplicar un filtro
    this.getPage();
    this.idCategoriaFiltrada = idCategoria;
    this.filtrandoPorCategoria = true;
  }

  quitarFiltro(): void {
    this.value = ''; // Limpiar el valor del filtro de búsqueda

    this.productoService.getPage(
      this.productosPorPagina,
      this.oPaginatorState.page,
      this.orderField,
      this.orderDirection,
      0 // Filtro por categoría establecido a 0 para mostrar todos los productos
    ).subscribe({
      next: (data: IProductoPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.productos = data.content;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });

    this.id_categoria = 0; // Restablecer el valor de id_categoria a 0

    this.filtrandoPorCategoria = false; // Desactivar la bandera de filtrado por categoría
  }

  agregarAlCarrito(producto: IProducto): void {
    if (this.sesionService.isSessionActive()) {
      this.carrito.user = { username: this.sesionService.getUsername() } as IUsuario;
      this.carrito.producto = { id: producto.id } as IProducto;
      this.carrito.cantidad = 1;
      this.CarritoService.newOne(this.carrito).subscribe({
        next: (data: ICarrito) => {
          this.carrito = data;
          this.matSnackBar.open('Producto añadido al carrito', 'Aceptar', { duration: 3000 });
          this.oRouter.navigate(['/usuario', 'carrito', 'plist']);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al añadir el producto al carrito', 'Aceptar', { duration: 3000 });
        }
      });
    }
  }

}
