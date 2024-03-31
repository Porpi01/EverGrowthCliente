import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPedido } from 'src/app/model/model.interfaces';
import { PedidoService } from 'src/app/service/Pedido.service';
import { PDFService } from './../../../service/PDF.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-pedido-detail-unrouted',
  templateUrl: './user-pedido-detail-unrouted.component.html',
  styleUrls: ['./user-pedido-detail-unrouted.component.css']
})
export class UserPedidoDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  pedidos: IPedido = {user:{} } as IPedido;
  status: HttpErrorResponse | null = null;
  

  constructor(
    private PedidoService: PedidoService,
    private router: Router,
    private PDFService : PDFService,
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
    this.PedidoService.getOne(this.id).subscribe({
      next: (data: IPedido) => {
        this.pedidos = data;
        console.log(this.pedidos.fecha_entrega) 
        console.log(this.pedidos.fecha_pedido)   
     
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

     //Añado esto
     imprimirFactura = (id_pedido: number) => {
      this.PDFService.imprimirFactura(id_pedido);
   
    }
  
    togglePedidoActive(pedido: IPedido): void {
      const pedidoToUpdate: IPedido = { ...pedido };
     
      pedidoToUpdate.active = !pedidoToUpdate.active;
  
      this.PedidoService.updateOne(pedidoToUpdate).subscribe({
        next: () => {
          this.forceReload.next(true);
        },
        error: (error) => {
          pedidoToUpdate.active = !pedidoToUpdate.active;
        }
      });
    }

  volverAtras() {
    this.router.navigate(['/home']);
  }
}
