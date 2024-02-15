import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ICarrito, ICarritoPage, IPedido, IProducto, IUsuario } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { SesionService } from 'src/app/service/Sesion.service';
import { PedidoService } from 'src/app/service/Pedido.service';

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
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  precioIndividualMap: Map<number, number> = new Map<number, number>();

  constructor(
    private CarritoService: CarritoService,
    private SesionService: SesionService,
    private PedidoService: PedidoService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private confirmationService: ConfirmationService
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
    const precioIndividual = precioProducto * cantidad;
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

  comprarUnicoCarrito(id_carrito: number) {
    this.SesionService.getSessionUser()?.subscribe({
      next: (user: IUsuario) => {
        this.user = user;
        this.confirmationService.confirm({
          message: '¿Desea comprar este carrito?',
          accept: () => {
            this.PedidoService.createCompraUnicoCarrito(user.id, id_carrito).subscribe({
              next: (pedido: IPedido) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/usuario', 'pedido', 'view', pedido.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 })
              }
            });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el user', 'Aceptar', { duration: 3000 })
      }
    });
  }

  comprarTodosCarritos() {
    this.SesionService.getSessionUser()?.subscribe({
      next: (user: IUsuario) => {
        this.user = user;
        this.confirmationService.confirm({
          message: '¿Desea comprar todos los carritos?',
          accept: () => {
            this.PedidoService.createCompraTodosCarritos(user.id).subscribe({
              next: (pedido: IPedido) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/usuario', 'pedido', 'view', pedido.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 })
              }
            });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el user', 'Aceptar', { duration: 3000 })
      }
    });

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
    this.confirmationService.confirm({
      message: '¿Desea eliminar todos los carritos?',
      accept: () => {
        this.CarritoService.deleteCarritoByUsuario(id_user).subscribe({
          next: () => {
            this.matSnackBar.open('Carritos eliminados', 'Aceptar', { duration: 3000 });
            this.getCarritos();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al eliminar los carritos', 'Aceptar', { duration: 3000 })
          }
        });
      }
    });
  }

  volverAtras() {
    this.router.navigate(['/home']);
  }
}
