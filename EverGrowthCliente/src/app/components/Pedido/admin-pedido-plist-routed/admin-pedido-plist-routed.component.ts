import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { PedidoService } from './../../../service/Pedido.service';

@Component({
  selector: 'app-admin-pedido-plist-routed',
  templateUrl: './admin-pedido-plist-routed.component.html',
  styleUrls: ['./admin-pedido-plist-routed.component.css'],
  providers: [ConfirmationService]
})
export class AdminPedidoPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  constructor(
    private PedidoService: PedidoService,
    private oMatSnackBar: MatSnackBar,
    private ConfirmationService: ConfirmationService,

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
        icon: "fa-solid fa-circle-plus"
      }
    ];
  }


  doGenerateRandom(amount: number) {
    this.bLoading = true;
    const totalSteps = 10; // Increase the number of steps
    const stepSize = 100 / totalSteps;
    this.loadingProgress = 0;
  
    const intervalId = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += stepSize; // Adjust the step size based on your loading process
      } else {
        clearInterval(intervalId);
        // Now that loading is complete, show the next content
        this.PedidoService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' users', '', { duration: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error generating users: ' + oError.message, '', { duration: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps); // Increase the interval duration based on your total steps
  }


  doEmpty($event: Event) {
    console.log('doEmpty called');
 
    this.ConfirmationService.confirm({
   
      target: $event.target as EventTarget,
      message: 'Are you sure you want to remove all producto?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.PedidoService.empty().subscribe({
        
          next: (oResponse: number) => {
            this.oMatSnackBar.open(`Now there are ${oResponse} producto.`, '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
            console.log($event);
            console.log('ConfirmationService called')
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open(`Error emptying producto: ${oError.message}`, '', { duration: 2000 });
            this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMatSnackBar.open('Operation cancelled!', '', { duration: 2000 });
      }
    });
  }

  

}
