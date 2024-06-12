import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioService } from './../../../service/Usuario.service';
import { IUsuarioPage } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { IUsuario } from './../../../model/model.interfaces';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css'],

})
export class AdminUserPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();


  oPage: IUsuarioPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuarios: IUsuario[] = [];
  userToRemove: IUsuario | null = null;
  ref: DynamicDialogRef | undefined;
  mostrarBotones: boolean = true;


  value: string = '';

  constructor(
    private UsuarioService: UsuarioService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MatSnackBar: MatSnackBar


  ) {
  }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      },
    });
  }


  onInputChange(query: string): void {
    if (query.length > 2) {
      this.oPaginatorState.page = 0; // Reinicia la página a 0 al aplicar un filtro
      this.UsuarioService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IUsuarioPage) => {
            this.oPage = data;
            this.usuarios = data.content;
            this.oPaginatorState.pageCount = data.totalPages;
            console.log(this.oPaginatorState);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          }
        });
    } else {
      this.getPage();
    }
  }

  getPage(): void {
    this.UsuarioService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IUsuarioPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.usuarios = data.content;
          console.log(this.oPaginatorState);
          console.log(this.usuarios);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  



  doRemove(user: IUsuario) {
    this.userToRemove = user;

    this.ConfirmationService.confirm({
      accept: () => {
        this.UsuarioService.removeOne(this.userToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MatSnackBar.open('El usuario ha sido eliminado', 'Cerrar', {
              duration: 2000,

            });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El usuario no ha sido eliminado', 'Cerrar', {
              duration: 2000,
             
            });          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open('El usuario no ha sido eliminado', 'Cerrar', {
          duration: 2000,
        });      }
    });
  }


}