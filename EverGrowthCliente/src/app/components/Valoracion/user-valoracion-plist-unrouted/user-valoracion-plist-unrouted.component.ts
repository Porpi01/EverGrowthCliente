import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IValoracionPage, IValoracion, IUsuario, IProducto } from 'src/app/model/model.interfaces';
import { ValoracionService } from './../../../service/Valoracion.service';
import { UsuarioService } from './../../../service/Usuario.service';
import { ProductoService } from './../../../service/Producto.service';
import { UserValoracionFormUnroutedComponent } from '../user-valoracion-form-unrouted/user-valoracion-form-unrouted.component';
import { SesionService } from 'src/app/service/Sesion.service';

@Component({
  selector: 'app-user-valoracion-plist-unrouted',
  templateUrl: './user-valoracion-plist-unrouted.component.html',
  styleUrls: ['./user-valoracion-plist-unrouted.component.css']
})
export class UserValoracionPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Output() valoracion_change = new EventEmitter<Boolean>();

  @Input() id_usuario: number = 0;
  @Input() id: number= 0;

  oPage: IValoracionPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 2, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  valoraciones: IValoracion[] = [];
  valoracionToRemove: IValoracion | null = null;
  ref: DynamicDialogRef | undefined;
  oUsuario: IUsuario | null = null;
  oProducto: IProducto | null = null;

  value: string = '';

  constructor(
    private ValoracionService: ValoracionService,
    private DialogService: DialogService,
    private UsuarioService: UsuarioService,
    private ProductoService: ProductoService,
    private SesionService: SesionService



  ) {

  }

  ngOnInit() {
    this.getPage();

 
    if (this.id_usuario > 0) {
      this.getUsuario();
      
    }
    if (this.id > 0) {
      this.getProducto();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      },
    });
  }


  getPage(): void {
    this.ValoracionService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_usuario, 
        this.id
      
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

 
  postNewThread(): void {
    if (this.id > 0 && this.SesionService.isSessionActive()) {

      this.ref = this.DialogService.open(UserValoracionFormUnroutedComponent, {
        data: {
          id_thread: this.id,
        },
        header: 'Nueva valoración',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe((nThread: number) => {
        this.getPage();
        this.valoracion_change.emit(true);
      });
    }
   
  }





  getUsuario(): void {
    this.UsuarioService.getOne(this.id_usuario).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;

        console.log(this.oUsuario.id);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

  getProducto(): void {
    this.ProductoService.getOne(this.id).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}