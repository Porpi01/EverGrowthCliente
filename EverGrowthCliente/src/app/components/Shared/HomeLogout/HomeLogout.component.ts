import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IProducto, IProductoPage, ICategoria, ICategoriaPage } from 'src/app/model/model.interfaces';
import { ProductoService } from 'src/app/service/Producto.service';
import { SesionService } from 'src/app/service/Sesion.service';
import { CategoriaService } from './../../../service/Categoria.service';

@Component({
  selector: 'app-HomeLogout',
  templateUrl: './HomeLogout.component.html',
  styleUrls: ['./HomeLogout.component.css']
})
export class HomeLogoutComponent implements OnInit {

  @Input() id_categoria: number = 0; // Filtro por categoría

  oPage: IProductoPage | undefined;
  productos: IProducto[] = [];
  categoria: ICategoria[] = [];
  productosPorPagina: number = 8;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState = { first: 0, rows: this.productosPorPagina, page: 0, pageCount: 0 };
  value: string = '';
  status: HttpErrorResponse | null = null;
  oProductoToRemove: IProducto | null = null;
  ref: DynamicDialogRef | undefined;
  oCategoria: ICategoria | null = null;
  strUserName: string = '';


  constructor(
    private productoService: ProductoService,
    private sesionService: SesionService,
    private CategoriaService: CategoriaService,
    private oRouter: Router
  ) { }

  ngOnInit() {
    this.strUserName = this.sesionService.getUsername();
    this.getPage();
    this.getCategorias();
    if (this.id_categoria > 0) {
      this.getCategoria();
    }
  }

 
  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = this.productosPorPagina;
    this.getPage();
  }

  getPage(): void {
    this.productoService
      .getPage(
        this.productosPorPagina,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_categoria
      )
      .subscribe({
        next: (data: IProductoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.productos = data.content;
          console.log(this.productos);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  getCategoria(): void {
    this.CategoriaService.getOne(this.id_categoria).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  getCategorias(): void {
    this.CategoriaService.getPage(undefined, undefined, 'id', 'asc').subscribe({
      next: (data: ICategoriaPage) => {
        this.categoria = data.content;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener las categorías', error);
      }
    });
  }

 



  

}