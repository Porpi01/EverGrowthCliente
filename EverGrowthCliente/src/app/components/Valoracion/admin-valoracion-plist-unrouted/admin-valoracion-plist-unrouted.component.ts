import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValoracionService } from './../../../service/Valoracion.service';
import { IValoracion, IValoracionPage } from 'src/app/model/model.interfaces';
import { AdminValoracionDetailUnroutedComponent } from '../admin-valoracion-detail-unrouted/admin-valoracion-detail-unrouted.component';

@Component({
  selector: 'app-admin-valoracion-plist-unrouted',
  templateUrl: './admin-valoracion-plist-unrouted.component.html',
  styleUrls: ['./admin-valoracion-plist-unrouted.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AdminValoracionPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: IValoracionPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];
  valoracionToRemove: IValoracion | null = null;
  ref: DynamicDialogRef | undefined;
 
  value: string = '';

  constructor(
    private ValoracionService: ValoracionService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MessageService: MessageService

    
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

  doView(valoracion: IValoracion) {
    this.ref = this.DialogService.open(AdminValoracionDetailUnroutedComponent, {
      data: {
        id: valoracion.id,
        openedFromView: true, 
    
      },
      header: 'Vista de la valoración',
      width: '60%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
 
  }


  doRemove(valoracion: IValoracion) {
    this.valoracionToRemove = valoracion;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.ValoracionService.removeOne(this.valoracionToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'La valoración ha sido eliminada' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La valoración no se ha podido eliminar' });
          }
        });
      },
      reject: () => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'La valoración no ha sido eliminada' });
      }
    });
  }

  
}