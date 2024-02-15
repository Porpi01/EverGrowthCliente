import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ValoracionService } from './../../../service/Valoracion.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-valoracion-plist-routed',
  templateUrl: './admin-valoracion-plist-routed.component.html',
  styleUrls: ['./admin-valoracion-plist-routed.component.css'],
})
export class AdminValoracionPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  id_usuario: number ;
  id_producto: number ;
  displayDialog: boolean = false;

  constructor(
    private ValoracionService: ValoracionService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private MatSnackBar : MatSnackBar
  ) {
    this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
    this.id_producto = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idproducto") ?? "0");
    console.log('id_usuario:', this.id_usuario);
    console.log('id_producto:', this.id_producto);
   }

  ngOnInit() {
    this.items = [
      {
        label: 'Borrar',
        icon: "fa-solid fa-circle-minus",
        command: () => this.displayDialog = true
      },
      {
        label: 'Crear',
        icon: "fa-solid fa-circle-plus",
        command: () => this.router.navigate(['admin/valoracion/new'])
      }
    ];
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    const totalSteps = 10;
    const stepSize = 100 / totalSteps;
    this.loadingProgress = 0;

    const intervalId = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += stepSize;
      } else {
        clearInterval(intervalId);
        this.ValoracionService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open(`Hay ${oResponse} valoraciones.`, 'Cerrar', {duration: 2000,});           
            this.bLoading = false;
          
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open(`Error al generar las valoraciones: ${oError.message}`, 'Cerrar', { duration: 2000,});
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.ValoracionService.empty().subscribe({
      next: (oResponse: number) => {
        console.log('Success response:', oResponse);
        this.MatSnackBar.open(`Hay ${oResponse} valoraciones.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar las valoraciones: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }

}