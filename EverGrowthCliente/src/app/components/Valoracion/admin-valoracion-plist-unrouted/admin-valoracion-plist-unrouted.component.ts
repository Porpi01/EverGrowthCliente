import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IValoracionPage, IValoracion } from 'src/app/model/model.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValoracionService } from '../../../service/Valoracion.service';
@Component({
  selector: 'app-admin-valoracion-plist-unrouted',
  templateUrl: './admin-valoracion-plist-unrouted.component.html',
  styleUrls: ['./admin-valoracion-plist-unrouted.component.css'],
  providers: [ConfirmationService]
})
export class AdminValoracionPlistUnroutedComponent implements OnInit {

 
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: IValoracionPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];
  valoracionToremove: IValoracion | null = null;
 
  value: string = '';
  constructor(
    private ValoracionService: ValoracionService,
    private ConfirmationService: ConfirmationService,
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
      this.ValoracionService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IValoracionPage) => {
            this.oPage = data;
            this.valoraciones = data.content;
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
    this.ValoracionService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IValoracionPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.valoraciones = data.content;
          console.log(this.oPaginatorState);
          console.log(this.valoraciones);
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

  doRemove(valoracion: IValoracion) {
    this.valoracionToremove = valoracion;
    this.ConfirmationService.confirm({
      accept: () => {
        this.MatSnackBar.open("The user has been removed.", '', { duration: 1200 });
        this.ValoracionService.removeOne(this.valoracionToremove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {

            this.status = error;
            this.MatSnackBar.open("The user hasn't been removed.", "", { duration: 1200 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open("The user hasn't been removed.", "", { duration: 1200 });
      }
    });
  }


}
