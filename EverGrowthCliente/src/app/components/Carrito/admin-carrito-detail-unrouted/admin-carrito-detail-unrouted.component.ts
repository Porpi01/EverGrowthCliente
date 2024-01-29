import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICarrito } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-carrito-detail-unrouted',
  templateUrl: './admin-carrito-detail-unrouted.component.html',
  styleUrls: ['./admin-carrito-detail-unrouted.component.css']
})
export class AdminCarritoDetailUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  carritos: ICarrito = {} as ICarrito;
  status: HttpErrorResponse | null = null;
  

  constructor(
    private CarritoService: CarritoService,
    private router: Router,
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
  }

  getOne(): void {
    this.CarritoService.getOne(this.id).subscribe({
      next: (data: ICarrito) => {
        this.carritos = data;
        
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  
  volverAtras() {
    this.router.navigate(['/admin/carrito/plist']);
  }
}
