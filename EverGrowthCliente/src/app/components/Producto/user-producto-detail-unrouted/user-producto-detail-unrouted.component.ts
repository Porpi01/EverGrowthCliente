import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICarrito, IProducto, IUsuario, IValoracion } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SesionService } from 'src/app/service/Sesion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CarritoService } from './../../../service/Carrito.service';


@Component({
  selector: 'app-user-producto-detail-unrouted',
  templateUrl: './user-producto-detail-unrouted.component.html',
  styleUrls: ['./user-producto-detail-unrouted.component.css']
})
export class UserProductoDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  id_producto: number = 0;
  id_usuario: number = 0;
  productosSeleccionados: IProducto[] = [];
  productos: IProducto = {} as IProducto;
  usuario: IUsuario | null = null;
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];
  carrito: ICarrito = { user: {}, producto: {}, cantidad: 0 } as ICarrito;
  cantidadSeleccionada: number = 1;


  constructor(
    private productoService: ProductoService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private SesionService: SesionService,

    private matSnackBar: MatSnackBar,
    private router: Router,
    private CarritoService: CarritoService
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }

    }
    this.SesionService.getSessionUser()?.subscribe({
      next: (usuario: IUsuario) => {
        this.usuario = usuario;
        this.id_usuario = usuario.id;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })

  }

  ngOnInit() {
    console.log(this.id);
    this.getOne();

  }



  getOne(): void {
    this.productoService.getOne(this.id).subscribe({
      next: (data: IProducto) => {
        this.productos = data;
        console.log(this.productos);
        console.log(data.nombre);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }


  getTotalAPagar(): number {
    const totalAPagar = this.productosSeleccionados.reduce((total, producto) => total + producto.precio, 0);
    return totalAPagar;
  }

  agregarAlCarrito(): void {
    if (this.SesionService.isSessionActive()) {
      if (this.cantidadSeleccionada <= this.productos.stock) {
        this.carrito.user = { username: this.SesionService.getUsername() } as IUsuario;
        this.carrito.producto = { id: this.productos.id } as IProducto;
        this.carrito.cantidad = this.cantidadSeleccionada;

        this.CarritoService.newOne(this.carrito).subscribe({
          next: (data: ICarrito) => {
            this.carrito = data;
            this.matSnackBar.open('Producto añadido al carrito', 'Aceptar', { duration: 3000 });
            this.router.navigate(['/usuario', 'carrito', 'plist']);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al añadir el producto al carrito', 'Aceptar', { duration: 3000 });
          }
        });
      } else {
        this.matSnackBar.open('La cantidad seleccionada supera el stock disponible', 'Aceptar', { duration: 3000 });
      }
    } else {
      this.matSnackBar.open('Debes iniciar sesión para añadir productos al carrito', 'Aceptar', { duration: 3000 });
      this.router.navigate(['/login']);

    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    // Verificar si la tecla presionada no es una flecha hacia arriba o abajo
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.preventDefault(); // Prevenir la acción predeterminada (escribir el valor)
    }
  }

}

