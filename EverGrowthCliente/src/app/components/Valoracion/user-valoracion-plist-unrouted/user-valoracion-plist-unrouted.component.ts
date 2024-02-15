import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit,   } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IValoracionPage, IValoracion, IUsuario, IProducto,  } from 'src/app/model/model.interfaces';
import { ValoracionService } from './../../../service/Valoracion.service';
import { SesionService } from './../../../service/Sesion.service';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { UserProductoValoracionUnroutedComponent } from '../../Producto/user-producto-valoracion-unrouted/user-producto-valoracion-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-valoracion-plist-unrouted',
  templateUrl: './user-valoracion-plist-unrouted.component.html',
  styleUrls: ['./user-valoracion-plist-unrouted.component.css']
})
export class UserValoracionPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_producto: number = 0;
  @Input() id_usuario: number = 0;



  page: IValoracionPage | undefined;
  producto: IProducto | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuario: IUsuario | null = null;
  ref: DynamicDialogRef | undefined;
  valoraciones: IValoracion[] = [];


  constructor(
    private ValoracionService: ValoracionService,
    private SesionService: SesionService,
    private ConfirmationService: ConfirmationService,
    private DialogService: DialogService,
    private MatSnackBar: MatSnackBar

  ) { }

  ngOnInit() {
    this.getValoraciones();

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

 

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
  
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
        console.log(id_valoracion);
        this.ValoracionService.removeOne(id_valoracion).subscribe({
          next: () => {
            this.getValoraciones();
            this.MatSnackBar.open('La valoración ha sido eliminada', 'Cerrar', {
              duration: 2000,
            });
            console.log(this.usuario?.id);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.MatSnackBar.open('La valoración no se ha podido eliminar', 'Cerrar', {
              duration: 2000,
            
            });
          }
        });
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
        header: 'Comparte tu opinión',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe({
        next: (v) => {
          if (v) {
            this.getValoraciones();
          }
        }
      })
   
    }else {
  this.MatSnackBar.open('Debes estar logueado para valorar un producto', 'Aceptar', { duration: 3000 });
    }
  }
}