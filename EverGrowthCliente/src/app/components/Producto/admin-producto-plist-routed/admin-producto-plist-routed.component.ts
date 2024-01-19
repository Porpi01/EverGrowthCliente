import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { ProductoService } from './../../../service/Producto.service';

@Component({
  selector: 'app-admin-producto-plist-routed',
  templateUrl: './admin-producto-plist-routed.component.html',
  styleUrls: ['./admin-producto-plist-routed.component.css'],
  providers: [ConfirmationService]
})
export class AdminProductoPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  constructor(
    private ProductoService: ProductoService,
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
    this.ProductoService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {

        this.oMatSnackBar.open('Now there are ' + oResponse + ' producto', '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open('Error generating producto: ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    });
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
        this.ProductoService.empty().subscribe({
        
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
