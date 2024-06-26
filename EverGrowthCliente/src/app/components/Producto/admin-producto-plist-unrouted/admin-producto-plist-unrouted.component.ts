import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';

import { ProductoService } from './../../../service/Producto.service';
import { ICategoria, IProducto, IProductoPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminProductoDetailUnroutedComponent } from '../admin-producto-detail-unrouted/admin-producto-detail-unrouted.component';
import { MediaService } from './../../../service/Media.service';
import { CategoriaService } from './../../../service/Categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-producto-plist-unrouted',
  templateUrl: './admin-producto-plist-unrouted.component.html',
  styleUrls: ['./admin-producto-plist-unrouted.component.css'],
  providers: [ConfirmationService,]
})
export class AdminProductoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_categoria: number = 0;


  oPage: IProductoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  productos: IProducto[] = [];
  productoToRemove: IProducto | null = null;
  imagenBase64: string | null = null;
  ref: DynamicDialogRef | undefined;
  oCategoria: ICategoria | null = null;
  mostrarBotones: boolean = true;

  value: string = '';
  url?: string;


  constructor(
    private ProductoService: ProductoService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MediaService: MediaService,
    private CategoriaService: CategoriaService,
    private MatSnackBar: MatSnackBar

  ) {
  }

  ngOnInit(): void {
    this.getPage();

    if (this.id_categoria > 0) {
      this.getCategoria();
      
    }
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

      this.ProductoService
        .getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_categoria, query)
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
        this.orderDirection,
        this.id_categoria,
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


  doRemove(producto: IProducto) {
    this.productoToRemove = producto;

    this.ConfirmationService.confirm({
      accept: () => {
        this.ProductoService.removeOne(this.productoToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.MatSnackBar.open('El producto ha sido eliminado', 'Cerrar', { duration: 2000 });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('Error al eliminar el producto', 'Cerrar', { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.MatSnackBar.open('El producto no ha sido eliminado', 'Cerrar', { duration: 2000 });
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

  getCategoria(): void {
    this.CategoriaService.getOne(this.id_categoria).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria = data;

        console.log(this.oCategoria.id);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}
