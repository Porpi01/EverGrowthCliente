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
  constructor(
    private CategoriaService: CategoriaService,
    private router: Router,
    private MessageService: MessageService,
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
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' categoría', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating categoría: ' + oError.message, life: 2000 });
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
      message: 'Are you sure you want to remove all categoría?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        console.log('Accept block reached');
        this.CategoriaService.empty().subscribe({
          next: (oResponse: number) => {
            console.log('Success response:', oResponse);
            this.MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Now there are ${oResponse} categoría.`,
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
              detail: `Error emptying categoría: ${oError.message}`,
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
          detail: 'Operation cancelled!',
          life: 2000
        });

      },
    });
  }



}