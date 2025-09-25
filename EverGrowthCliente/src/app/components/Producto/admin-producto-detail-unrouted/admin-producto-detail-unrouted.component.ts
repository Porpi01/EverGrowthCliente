import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IProducto, IUsuario } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-producto-detail-unrouted',
  templateUrl: './admin-producto-detail-unrouted.component.html',
  styleUrls: ['./admin-producto-detail-unrouted.component.css']
})
export class AdminProductoDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  productos: IProducto = {} as IProducto;
  status: HttpErrorResponse | null = null;
  @Input() mostrarBotones: boolean = true;


  constructor(
    private ProductoService: ProductoService,
    private router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
    }
  }

  ngOnInit() {
    
    this.getOne();
  }

  getOne(): void {
    this.ProductoService.getOne(this.id).subscribe({
      next: (data: IProducto) => {
        this.productos = data;
         
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  volverAtras() {
    this.router.navigate(['/admin/producto/plist']);
  }

}
