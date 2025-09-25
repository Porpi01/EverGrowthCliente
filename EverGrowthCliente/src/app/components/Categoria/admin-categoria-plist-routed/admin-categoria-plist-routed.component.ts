import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CategoriaService } from './../../../service/Categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-categoria-plist-routed',
  templateUrl: './admin-categoria-plist-routed.component.html',
  styleUrls: ['./admin-categoria-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]

})
export class AdminCategoriaPlistRoutedComponent implements OnInit {

  
  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  displayDialog: boolean = false;
  constructor(
    private CategoriaService: CategoriaService,
    private router: Router,
    private MessageService: MessageService,
 private MatSnackBar: MatSnackBar

  ) { }

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
        command: () => this.router.navigate(['admin/categoria/new'])
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
        this.CategoriaService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open('Hay ' + oResponse + ' categoría', 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open('Error al generar categorias: ' + oError.message, 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.CategoriaService.empty().subscribe({
      next: (oResponse: number) => {
        this.MatSnackBar.open(`Hay ${oResponse} categorías.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        this.MatSnackBar.open(`Error al eliminar las categorías: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }



}
