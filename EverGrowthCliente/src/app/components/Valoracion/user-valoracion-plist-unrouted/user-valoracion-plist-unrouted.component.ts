import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IValoracionPage, IValoracion, IUsuario, IProducto,  } from 'src/app/model/model.interfaces';
import { ValoracionService } from './../../../service/Valoracion.service';
import { SesionService } from './../../../service/Sesion.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserValoracionFormUnroutedComponent } from '../user-valoracion-form-unrouted/user-valoracion-form-unrouted.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { UserProductoValoracionUnroutedComponent } from '../../Producto/user-producto-valoracion-unrouted/user-producto-valoracion-unrouted.component';


@Component({
  selector: 'app-user-valoracion-plist-unrouted',
  templateUrl: './user-valoracion-plist-unrouted.component.html',
  styleUrls: ['./user-valoracion-plist-unrouted.component.css']
})
export class UserValoracionPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_producto: number = 0;
  @Input() id_usuario: number = 0;
  @Output() valoracion_change = new EventEmitter<Boolean>();



  page: IValoracionPage | undefined;
  producto: IProducto | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 3, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuario: IUsuario | null = null;
  ref: DynamicDialogRef | undefined;
  valoraciones: IValoracion[] = [];


  constructor(
    private ValoracionService: ValoracionService,
    private SesionService: SesionService,
    private ConfirmationService: ConfirmationService,
    private MessageService: MessageService,
    private DialogService: DialogService,

  ) { }

  ngOnInit() {
    this.getValoraciones();
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getValoraciones();}
      }
    });
    this.SesionService.getSessionUser()?.subscribe({
      next: (usuario: IUsuario) => {
        this.usuario = usuario;
        this.id_usuario = usuario.id;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  getPage(): void {
    this.ValoracionService
      .getPage(
        this.paginatorState.rows,
        this.paginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_producto, 
        this.id_usuario
      
      )
      .subscribe({
        next: (data: IValoracionPage) => {
          this.page = data;
          this.paginatorState.pageCount = data.totalPages;
          this.valoraciones = data.content;
          console.log(this.paginatorState);
          console.log(this.valoraciones);
          console.log(this.id_producto);
          console.log(this.id_usuario);
          
         
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

 

  getValoraciones() {
    const rows: number = this.paginatorState.rows ?? 0;
    const page: number = this.paginatorState.page ?? 0;
    this.ValoracionService.getValoracionPageByProducto(this.id_producto, page, rows, this.orderField, this.orderDirection).subscribe({
      next: (page: IValoracionPage) => {
        this.page = page;
        this.paginatorState.pageCount = page.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }


  recargarValoraciones() {
    this.getValoraciones();
  }

  isUsuarioValoracion(valoracion: IValoracion): boolean {
    return this.usuario !== null && valoracion.user.id === this.usuario.id;
   
  }

  borrarValoracion(id_valoracion: number) {
    this.ConfirmationService.confirm({
      message: '¿Estás seguro de que quieres borrar la valoración?',
      accept: () => {
        this.ValoracionService.removeOne(id_valoracion).subscribe({
          next: () => {
            this.getValoraciones();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'La valoración ha sido eliminada' });
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La valoración no se ha podido eliminar' });
          }
        })
      }
    });
    
  }

  postNuevaValoracion(): void {
    if (this.id_producto > 0 && this.SesionService.isSessionActive()) {

      this.ref = this.DialogService.open(UserProductoValoracionUnroutedComponent, {
        data: {
          id_producto: this.id_producto,
          id_usuario: this.id_usuario
          
        },
        header: 'Nueva valoración',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe((nProducto: number) => {
        this.getPage();
        this.valoracion_change.emit(true);
      });
    }
   
  }
}