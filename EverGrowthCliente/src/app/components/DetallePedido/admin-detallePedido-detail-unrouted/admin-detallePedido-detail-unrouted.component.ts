import { Component, Input, OnInit, Optional } from '@angular/core';
import { IDetallePedido } from 'src/app/model/model.interfaces';
import { DetallePedidoService } from './../../../service/DetallePedido.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-detallePedido-detail-unrouted',
  templateUrl: './admin-detallePedido-detail-unrouted.component.html',
  styleUrls: ['./admin-detallePedido-detail-unrouted.component.css']
})
export class AdminDetallePedidoDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  detallePedidos: IDetallePedido = {} as IDetallePedido;
  status: HttpErrorResponse | null = null;
  

  constructor(
    private DetallePedidoService: DetallePedidoService,
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
    this.DetallePedidoService.getOne(this.id).subscribe({
      next: (data: IDetallePedido) => {
        this.detallePedidos = data;
        
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  calculateTotalPrice(detallePedido: IDetallePedido, quantity: number, unitPrice: number): string {
    const totalPrice = quantity * unitPrice;
    const totalWithIVA = totalPrice + (totalPrice * detallePedido.iva);
    return totalWithIVA.toFixed(2);
}


  volverAtras() {
    this.router.navigate(['/admin/detallePedido/plist']);
  }
}
