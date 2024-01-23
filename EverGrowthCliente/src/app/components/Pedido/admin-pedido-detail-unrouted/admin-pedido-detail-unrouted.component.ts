import { Component, Input, OnInit, Optional } from '@angular/core';
import { PedidoService } from './../../../service/Pedido.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPedido, IUsuario } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-admin-pedido-detail-unrouted',
  templateUrl: './admin-pedido-detail-unrouted.component.html',
  styleUrls: ['./admin-pedido-detail-unrouted.component.css']
})
export class AdminPedidoDetailUnroutedComponent implements OnInit {
    @Input() id: number = 1;
    pedidos: IPedido = {} as IPedido;
    status: HttpErrorResponse | null = null;
    
  
    constructor(
      private PedidoService: PedidoService,
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
          console.log(this.pedidos)    
       
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      });
    }
  }
  

