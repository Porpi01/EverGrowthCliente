import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UsuarioService } from './../../../service/Usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({

  selector: 'app-admin-user-plist-routed',
  templateUrl: './admin-user-plist-routed.component.html',
  styleUrls: ['./admin-user-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminUserPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  displayDialog: boolean = false;

  constructor(
    private UsuarioService: UsuarioService,
    private router: Router,
    private MatSnackBar: MatSnackBar,


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
        command: () => this.router.navigate(['admin/usuario/new'])
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
        this.UsuarioService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open('Hay ' + oResponse + ' usuarios', 'Cerrar', {
              duration: 2000,

            });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open('Error al generar usuarios: ' + oError.message, 'Cerrar', {
              duration: 2000,
            });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.UsuarioService.empty().subscribe({
      next: (oResponse: number) => {
        this.MatSnackBar.open(`Hay ${oResponse} usuarios.`, 'Cerrar', { duration: 2000, });

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false;
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar los usuarios: ${oError.message}`, 'Cerrar', { duration: 2000, });
        this.bLoading = false;
      },
    });
  }


}