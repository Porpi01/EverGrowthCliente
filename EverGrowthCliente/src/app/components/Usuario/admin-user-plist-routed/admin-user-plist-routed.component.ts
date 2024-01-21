import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UsuarioService } from './../../../service/Usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({

  selector: 'app-admin-user-plist-routed',
  templateUrl: './admin-user-plist-routed.component.html',
  styleUrls: ['./admin-user-plist-routed.component.css'],
  providers: [ConfirmationService]
})
export class AdminUserPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  constructor(
    private UsuarioService: UsuarioService,
    private ConfirmationService: ConfirmationService,
    private router: Router,
    private MessageService: MessageService

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
          this.MessageService.add({ severity: 'success',  detail: 'Now there are ' + oResponse + ' users', life: 2000 });
          this.bLoading = false;
        },
        error: (oError: HttpErrorResponse) => {
          this.MessageService.add({ severity: 'error', detail: 'Error generating users: ' + oError.message, life: 2000 });
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
      message: 'Are you sure you want to remove all users?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        console.log('Accept block reached');
        this.UsuarioService.empty().subscribe({
          next: (oResponse: number) => {
            console.log('Success response:', oResponse);
            this.MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Now there are ${oResponse} users.`,
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
              detail: `Error emptying users: ${oError.message}`,
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