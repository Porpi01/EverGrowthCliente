import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';

import { ProductoService } from './../../../service/Producto.service';
import { IProducto, IProductoPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminProductoDetailUnroutedComponent } from '../admin-producto-detail-unrouted/admin-producto-detail-unrouted.component';
import { MediaService } from './../../../service/Media.service';
@Component({
  selector: 'app-admin-producto-plist-unrouted',
  templateUrl: './admin-producto-plist-unrouted.component.html',
  styleUrls: ['./admin-producto-plist-unrouted.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminProductoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();


  oPage: IProductoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  productos: IProducto[] = [];
  productoToRemove: IProducto | null = null;
  imagenBase64: string | null = null;
  ref: DynamicDialogRef | undefined;

  value: string = '';
  url?: string;


  constructor(
    private ProductoService: ProductoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MessageService: MessageService,
    private MediaService: MediaService,

  ) {
  }

  ngOnInit(): void {
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
      this.ProductoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IProductoPage) => {
            this.oPage = data;
            this.productos = data.content;
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
    this.ProductoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content;
          console.log(this.oPaginatorState);
          console.log(this.productos);
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

  doView(producto: IProducto) {
    this.ref = this.DialogService.open(AdminProductoDetailUnroutedComponent, {
      data: {
        id: producto.id
      },
      header: 'View Producto',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  doRemove(producto: IProducto) {
    this.productoToRemove = producto;

    this.ConfirmationService.confirm({
      accept: () => {
        this.ProductoService.removeOne(this.productoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'The producto has been removed.' });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'The producto hasn\'t been removed.' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MessageService.add({ severity: 'info', summary: 'Info', detail: 'The producto hasn\'t been removed.' });
      }
    });
  }

  upload(event: any) {
    const file = event.target.files[0];
    console.log(file, 'file');
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.MediaService.uploadFile(formData).subscribe(response => {
        console.log(response, 'response');
        this.url = response.url;
      }

      );
    }
  }

}