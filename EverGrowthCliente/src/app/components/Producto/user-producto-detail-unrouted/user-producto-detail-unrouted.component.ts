import { Component, Input, OnInit, Optional } from '@angular/core';
import { IProducto, IUsuario, IValoracion } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ValoracionService } from './../../../service/Valoracion.service';
import { SesionService } from 'src/app/service/Sesion.service';
import { ConfirmationService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/service/Pedido.service';


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
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];

  constructor(
    private productoService: ProductoService,
    private ValoracionService: ValoracionService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private SesionService: SesionService,
    private ConfirmationService: ConfirmationService,
    private PedidoService: PedidoService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {
    if (config && config.data) {
      this.id = config.data.id;
      console.log(this.config.data);
    }
 
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

  addToCart(product: IProducto) {
    this.productosSeleccionados.push(product);
    console.log(this.productosSeleccionados);
    console.log(`Producto '${product.nombre}' añadido al carrito.`);
    this.matSnackBar.open('Producto añadido', 'Aceptar', {duration: 3000});
  }

  makeProductPurhase(product: IProducto): void {
    this.SesionService.getSessionUser()?.subscribe({
      next: (user: IUsuario) => {
        if (user) {
          this.ConfirmationService.confirm({
            message: '¿Quieres comprar el producto?',
            accept: () => {
              const cantidad = 1;
              this.PedidoService.makeProductPurhase(product.id, user.id, cantidad).subscribe({
                next: () => {
                  this.matSnackBar.open('Producto comprado', 'Aceptar', {duration: 3000});
                  this.router.navigate(['/usuario', 'carrito', 'view', product.id]);
                  console.log('Producto comprado');
                },
                error: (err: HttpErrorResponse) => {
                  this.status = err;
                  this.matSnackBar.open('Error al comprar el producto', 'Aceptar', {duration: 3000});
                }
              });
              },
            reject: () => {
              this.matSnackBar.open('Compra cancelada', 'Aceptar', {duration: 3000});
            }
            })
        } else {
          this.matSnackBar.open('Debes estar logueado para comprar productos', 'Aceptar', {duration: 3000});
        };
        },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al obtener el usuario', 'Aceptar', {duration: 3000});
      }
      });
    }

  
}


