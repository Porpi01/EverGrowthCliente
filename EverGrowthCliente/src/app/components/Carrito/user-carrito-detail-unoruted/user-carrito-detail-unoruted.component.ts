import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ICarrito } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';

@Component({
  selector: 'app-user-carrito-detail-unoruted',
  templateUrl: './user-carrito-detail-unoruted.component.html',
  styleUrls: ['./user-carrito-detail-unoruted.component.css']
})
export class UserCarritoDetailUnorutedComponent implements OnInit {

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

  getDetailsArray(): number[] {
    return Array.from({ length: this.carritos.cantidad }, (_, index) => index);
  }

}
