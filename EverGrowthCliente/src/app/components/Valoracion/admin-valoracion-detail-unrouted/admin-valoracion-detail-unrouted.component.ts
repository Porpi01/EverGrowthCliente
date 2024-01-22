import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IValoracion } from 'src/app/model/model.interfaces';
import { ValoracionService } from './../../../service/Valoracion.service';

@Component({
  selector: 'app-admin-valoracion-detail-unrouted',
  templateUrl: './admin-valoracion-detail-unrouted.component.html',
  styleUrls: ['./admin-valoracion-detail-unrouted.component.css']
})
export class AdminValoracionDetailUnroutedComponent implements OnInit {

  
  @Input() id: number = 1;
  valoraciones: IValoracion = {} as IValoracion;
  status: HttpErrorResponse | null = null;
  

  constructor(
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
  }

  getOne(): void {
    this.ValoracionService.getOne(this.id).subscribe({
      next: (data: IValoracion) => {
        this.valoraciones = data;
        console.log(this.valoraciones.user.apellido1)    
        console.log(data.titulo)  
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
}
