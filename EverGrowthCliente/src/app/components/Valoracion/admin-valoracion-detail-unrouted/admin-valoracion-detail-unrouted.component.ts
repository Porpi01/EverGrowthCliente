import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IValoracion } from 'src/app/model/model.interfaces';
import { ValoracionService } from './../../../service/Valoracion.service';
import { Router } from '@angular/router';
import {  MessageService } from 'primeng/api';


@Component({
  selector: 'app-admin-valoracion-detail-unrouted',
  templateUrl: './admin-valoracion-detail-unrouted.component.html',
  styleUrls: ['./admin-valoracion-detail-unrouted.component.css'],
  providers: [MessageService]
})
export class AdminValoracionDetailUnroutedComponent implements OnInit {

  
  @Input() id: number = 1;
  @Input() openedFromView: boolean;
  mostrarBotones: boolean;

  valoraciones: IValoracion = {} as IValoracion;
  status: HttpErrorResponse | null = null;


  constructor(
    private ValoracionService: ValoracionService,
    private router: Router,
   
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
      console.log(this.config.data);
      
    }
    this.mostrarBotones = true; 
    this.openedFromView = false;
  }

  ngOnInit() {
    console.log(this.id);
    console.log(this.mostrarBotones);
    this.mostrarBotones =!this.openedFromView;


    this.getOne();
  }

  getOne(): void {
    this.ValoracionService.getOne(this.id).subscribe({
      next: (data: IValoracion) => {
        this.valoraciones = data;
        console.log(data.titulo)  
        console.log(data.fecha)
       
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  volverAtras() {
    this.router.navigate(['/admin/valoracion/plist']);
  }
}
