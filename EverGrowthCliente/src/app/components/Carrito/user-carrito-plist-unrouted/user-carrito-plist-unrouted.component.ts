import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ICarrito, ICarritoPage, IDetallePedido, IPedido, IProducto, IUsuario } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { SesionService } from 'src/app/service/Sesion.service';
import { PedidoService } from 'src/app/service/Pedido.service';
import { PDFService } from './../../../service/PDF.service';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';

@Component({
  selector: 'app-user-carrito-plist-unrouted',
  templateUrl: './user-carrito-plist-unrouted.component.html',
  styleUrls: ['./user-carrito-plist-unrouted.component.css']
})
export class UserCarritoPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: ICarritoPage | undefined;
  user: IUsuario | null = null;
  producto: IProducto | null = null;
  carrito: ICarrito = { user: {}, producto: {}, cantidad: 0 } as ICarrito;
  costeTotal: number = 0;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 20, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  precioIndividualMap: Map<number, number> = new Map<number, number>();
  displayDialogCompra: boolean = false;
  displayDialogBorrar: boolean = false;

  idUserToDelete: number | undefined; // Variable para almacenar el ID del usuario a eliminar



  constructor(
    private CarritoService: CarritoService,
    private SesionService: SesionService,
    private PedidoService: PedidoService,
    private router: Router,
    private matSnackBar: MatSnackBar,
   
  ) { }

  ngOnInit() {
    this.getCarritos();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getCarritos();
        }
      }
    })


  }

  getCarritos(): void {
    this.SesionService.getSessionUser()?.subscribe({
      next: (user: IUsuario) => {
        this.user = user;
        const rows: number = this.paginatorState.rows ?? 0;
        const page: number = this.paginatorState.page ?? 0;
        this.CarritoService.getCarritosByUsuario(this.user.id, rows, page, this.orderField, this.orderDirection).subscribe({
          next: (page: ICarritoPage) => {
            this.page = page;
            this.paginatorState.pageCount = this.page.totalPages;
            this.page.content.forEach((carrito: ICarrito) => {
              this.getCosteCarrito(carrito);
            })
            this.updateCosteTotal();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al recuperar los carritos', 'Aceptar', { duration: 3000 })
          }
        });
      }
    })
  }

  getCosteCarrito(carrito: ICarrito): void {
    const precioProducto = carrito.producto.precio;
    const cantidad = carrito.cantidad;
    const iva = carrito.producto.iva;
    const precioIndividual = precioProducto * cantidad * (1 + iva);
    this.precioIndividualMap.set(carrito.id, precioIndividual);
  }

  updateCantidad(carrito: ICarrito, nuevaCantidad: number): void {
    const stockDisponible = carrito.producto.stock;

    if (nuevaCantidad >= 0 && nuevaCantidad <= stockDisponible) {
      carrito.user = { id: carrito.user.id } as IUsuario;
      carrito.producto = { id: carrito.producto.id } as IProducto;
      carrito.cantidad = nuevaCantidad;

      if (nuevaCantidad === 0) {
        this.eliminarDelCarrito(carrito.id);
      } else {
        this.CarritoService.updateOne(carrito).subscribe({
          next: (data: ICarrito) => {
            this.matSnackBar.open('Cantidad actualizada', 'Aceptar', { duration: 3000 });
            this.getCosteCarrito(data);
            this.updateCosteTotal();
            this.getCarritos();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al actualizar la cantidad', 'Aceptar', { duration: 3000 });
          }
        });
      }
    } else {
      this.matSnackBar.open('No hay suficiente stock disponible', 'Aceptar', { duration: 3000 });
    }
  }

  updateCosteTotal(): void {
    if (this.user) {
      this.CarritoService.getCosteCarritoByUsuario(this.user.id).subscribe({
        next: (coste: number) => {
          this.costeTotal = coste;
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al recuperar el coste total', 'Aceptar', { duration: 3000 });
        }
      });
    } else {
      this.SesionService.getSessionUser()?.subscribe({
        next: (user: IUsuario) => {
          this.user = user;
          this.updateCosteTotal(); // Llamada recursiva para actualizar el costo total una vez que se ha obtenido el usuario
        }
      });
    }
  }



  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getCarritos();
  }



  comprarTodosCarritos() {
    this.SesionService.getSessionUser()?.subscribe({
      next: (user: IUsuario) => {
        this.user = user;
        this.displayDialogCompra = true; // Mostrar el diálogo de confirmación
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el usuario', 'Aceptar', { duration: 3000 });
      }
    });
  }

  confirmCompra() {
    if (this.user) {
      this.PedidoService.createCompraTodosCarritos(this.user.id).subscribe({
        next: (pedido: IPedido) => {
          this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
          // this.PDFService.imprimirFactura(pedido.id);
          this.router.navigate(['/usuario', 'pedido', 'view', pedido.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 });
        }
      });
    }
    this.displayDialogCompra = false; // Cerrar el diálogo de confirmación
  }

  cancelCompra() {
    this.displayDialogCompra = false; // Cerrar el diálogo de confirmación
  }


  eliminarDelCarrito(id_carrito: number): void {

    this.CarritoService.removeOne(id_carrito).subscribe({
      next: () => {
        this.matSnackBar.open('Carrito eliminado', 'Aceptar', { duration: 3000 });
        this.getCarritos();
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al eliminar el carrito', 'Aceptar', { duration: 3000 })
      }
    });

  }

  eliminarTodosCarritos(id_user: number): void {
    this.idUserToDelete = id_user;
    this.displayDialogBorrar = true; // Mostrar el diálogo de confirmación
  }

  confirmDelete() {
    if (this.idUserToDelete !== undefined) {
      this.CarritoService.deleteCarritoByUsuario(this.idUserToDelete).subscribe({
        next: () => {
          this.matSnackBar.open('Carritos eliminados', 'Aceptar', { duration: 3000 });
          this.getCarritos();
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al eliminar los carritos', 'Aceptar', { duration: 3000 });
        }
      });
    }
    this.displayDialogBorrar = false; // Cerrar el diálogo de confirmación
  }

  cancelDelete() {
    this.displayDialogBorrar = false; // Cerrar el diálogo de confirmación sin realizar ninguna acción
  }

  volverAtras() {
    this.router.navigate(['/home']);
  }
}
