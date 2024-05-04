import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { IUsuario } from 'src/app/model/model.interfaces';
import { UsuarioService } from 'src/app/service/Usuario.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-detail-unrouted',
  templateUrl: './admin-user-detail-unrouted.component.html',
  styleUrls: ['./admin-user-detail-unrouted.component.css']
})
export class AdminUserDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() mostrarBotones: boolean = true;

  usuarios: IUsuario = {} as IUsuario;
  status: HttpErrorResponse | null = null;


  constructor(
    private usuarioService: UsuarioService,
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
    this.usuarioService.getOne(this.id).subscribe({
      next: (data: IUsuario) => {
        this.usuarios = data;
        console.log(this.usuarios)
        console.log(data.nombre)
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  volverAtras() {
    this.router.navigate(['/admin/usuario/plist']);
  }

}
