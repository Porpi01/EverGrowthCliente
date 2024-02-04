import { Component, Input, OnInit, Optional } from '@angular/core';
import { IProducto, IValoracion } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ValoracionService } from './../../../service/Valoracion.service';

@Component({
  selector: 'app-user-producto-detail-unrouted',
  templateUrl: './user-producto-detail-unrouted.component.html',
  styleUrls: ['./user-producto-detail-unrouted.component.css']
})
export class UserProductoDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  idProducto: number = 1;
  productosSeleccionados: IProducto[] = [];
  productos: IProducto = {} as IProducto;
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];

  constructor(
    private productoService: ProductoService,
  private ValoracionService: ValoracionService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) { 
    if (config && config.data) {
      this.id = config.data.id;
      console.log(this.config.data);
    }
  }

  ngOnInit() {
    console.log(this.id);   
    this.getOne();
    this.getValoraciones();
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

  getValoraciones(): void {
    this.ValoracionService.getValoracionesPorProducto(this.id).subscribe({
      next: (data: IValoracion[]) => {
        this.valoraciones = data;
        console.log(this.valoraciones);   
        console.log()
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  addToCart(producto: IProducto) {
    this.productosSeleccionados.push(producto);
    console.log(`Producto '${producto.nombre}' añadido al carrito.`);
  }
}


