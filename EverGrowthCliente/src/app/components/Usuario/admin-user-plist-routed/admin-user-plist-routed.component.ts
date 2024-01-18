import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { UsuarioService } from './../../../service/Usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(
    private UsuarioService: UsuarioService,
    private oMatSnackBar: MatSnackBar,

  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Borrar',
        icon: "fa-solid fa-circle-minus"
      },
      {
        label: 'Crear',
        icon: "fa-solid fa-circle-plus"
      }
    ];
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.UsuarioService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {

        this.oMatSnackBar.open('Now there are ' + oResponse + ' users', '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open('Error generating users: ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    });
  }



}
