import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { ValoracionService } from './../../../service/Valoracion.service';


@Component({
  selector: 'app-admin-valoracion-plist-routed',
  templateUrl: './admin-valoracion-plist-routed.component.html',
  styleUrls: ['./admin-valoracion-plist-routed.component.css'],
  providers: [ConfirmationService]
})
export class AdminValoracionPlistRoutedComponent implements OnInit {


 
  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  constructor(
    private ValoracionService: ValoracionService,
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
    this.ValoracionService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {

        this.oMatSnackBar.open('Now there are ' + oResponse + ' valoraciones', '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open('Error generating valoraciones: ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    });
  }

  doEmpty($event: Event) {
    console.log('doEmpty called');
 
    this.ConfirmationService.confirm({
   
      target: $event.target as EventTarget,
      message: 'Are you sure you want to remove all valoraciones?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.ValoracionService.empty().subscribe({
        
          next: (oResponse: number) => {
            this.oMatSnackBar.open(`Now there are ${oResponse} valoraciones.`, '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
            console.log($event);
            console.log('ConfirmationService called')
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open(`Error emptying valoraciones: ${oError.message}`, '', { duration: 2000 });
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
