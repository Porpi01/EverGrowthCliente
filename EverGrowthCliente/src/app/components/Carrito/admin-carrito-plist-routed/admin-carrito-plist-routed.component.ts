import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CarritoService } from './../../../service/Carrito.service';
import { Router } from '@angular/router';

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
  constructor(
    private CarritoService: CarritoService,
    private MessageService: MessageService,    
    private ConfirmationService: ConfirmationService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Borrar',
        icon: "fa-solid fa-circle-minus",
        command: () => this.doEmpty(new Event('click'))

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
            this.MessageService.add({ severity: 'success', detail: 'Hay ' + oResponse + ' carrito', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error al generar carritos ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    console.log('doEmpty called');

    this.ConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: '¿Seguro que quieres eliminar los detalle pedidos?',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        console.log('Accept block reached');
        this.CarritoService.empty().subscribe({
          next: (oResponse: number) => {
            console.log('Hay', oResponse);
            this.MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Hay ${oResponse} carritos.`,
              life: 2000
            });

            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            console.error('Error response:', oError);
            this.MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al borrar carritos: ${oError.message}`,
              life: 2000
            });

            this.bLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Reject block reached');
        this.MessageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Operación cancelada',
          life: 2000
        });

      },
    });
  }

}
