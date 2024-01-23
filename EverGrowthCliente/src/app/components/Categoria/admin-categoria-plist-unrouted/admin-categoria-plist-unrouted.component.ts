import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { ICategoriaPage, ICategoria } from 'src/app/model/model.interfaces';
import { CategoriaService } from './../../../service/Categoria.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCategoriaDetailUnroutedComponent } from '../admin-categoria-detail-unrouted/admin-categoria-detail-unrouted.component';

@Component({
  selector: 'app-admin-categoria-plist-unrouted',
  templateUrl: './admin-categoria-plist-unrouted.component.html',
  styleUrls: ['./admin-categoria-plist-unrouted.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AdminCategoriaPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  

  oPage: ICategoriaPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  categoria: ICategoria[] = [];
  categoriaToRemove: ICategoria | null = null;
  ref: DynamicDialogRef | undefined;
 
  value: string = '';

  constructor(
    private CategoriaService: CategoriaService,
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
      this.CategoriaService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: ICategoriaPage) => {
            this.oPage = data;
            this.categoria = data.content;
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
    this.CategoriaService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: ICategoriaPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.categoria = data.content;
          console.log(this.oPaginatorState);
          console.log(this.categoria);
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

  doView(categoria: ICategoria) {
    this.ref = this.DialogService.open(AdminCategoriaDetailUnroutedComponent, {
      data: {
        id: categoria.id
      },
      header: 'View categoría',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  doRemove(categoria: ICategoria) {
    this.categoriaToRemove  = categoria;
  
    this.ConfirmationService.confirm({
      accept: () => {
        this.CategoriaService.removeOne(this.categoriaToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'The categoría has been removed.' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'The categoría hasn\'t been removed.' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'The categoría hasn\'t been removed.' });
      }
    });
  }

}
