import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IPedido, IPedidoPage, IUsuario } from 'src/app/model/model.interfaces';
import { PedidoService } from 'src/app/service/Pedido.service';
import { UsuarioService } from 'src/app/service/Usuario.service';

@Component({
  selector: 'app-user-user-detail-unrouted',
  templateUrl: './user-user-detail-unrouted.component.html',
  styleUrls: ['./user-user-detail-unrouted.component.css']
})
export class UserUserDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  usuarios: IUsuario = {} as IUsuario;
  status: HttpErrorResponse | null = null;
  mostrarBotones: boolean;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
    }
    this.mostrarBotones = true; 
  }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.usuarioService.getOne(this.id).subscribe({
      next: (data: IUsuario) => {
        this.usuarios = data;
        
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

}
