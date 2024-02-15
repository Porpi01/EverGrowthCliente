import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CarritoService } from './../../../service/Carrito.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-carrito-plist-routed',
  templateUrl: './admin-carrito-plist-routed.component.html',
  styleUrls: ['./admin-carrito-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminCarritoPlistRoutedComponent implements OnInit {

  
  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  id_usuario: number ;
  id_producto: number ;
  displayDialog: boolean = false;


  constructor(
    private CarritoService: CarritoService,
    private MessageService: MessageService,    
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private MatSnackBar: MatSnackBar


  ) {
    this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
    this.id_producto = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idproducto") ?? "0");
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
        command: () => this.router.navigate(['admin/carrito/new'])
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
        this.CarritoService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open('Hay ' + oResponse + ' carrito', 'Cerrar', { duration: 2000, panelClass: ['success-snackbar'] });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open('Error al generar carritos: ' + oError.message, 'Cerrar', { duration: 2000, panelClass: ['error-snackbar'] });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.CarritoService.empty().subscribe({
      next: (oResponse: number) => {
        console.log('Success response:', oResponse);
        this.MatSnackBar.open(`Hay ${oResponse} categorías.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar las categorías: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }
}
