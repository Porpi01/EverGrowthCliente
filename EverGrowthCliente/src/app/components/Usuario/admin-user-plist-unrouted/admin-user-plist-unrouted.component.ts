import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from './../../../service/Usuario.service';
import { IUsuarioPage } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { IUsuario } from './../../../model/model.interfaces';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';


@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
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

  constructor(
    private UsuarioService: UsuarioService,
    private ConfirmDialogModule: ConfirmDialogModule,
    private ConfirmationService: ConfirmationService,
  ) { }

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
        // this.oMatSnackBar.open("The user has been removed.", '', { duration: 1200 });
        this.UsuarioService.removeOne(this.userToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {

            this.status = error;
            // this.oMatSnackBar.open("The user hasn't been removed.", "", { duration: 1200 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        //this.oMatSnackBar.open("The user hasn't been removed.", "", { duration: 1200 });
      }
    });
  }

}