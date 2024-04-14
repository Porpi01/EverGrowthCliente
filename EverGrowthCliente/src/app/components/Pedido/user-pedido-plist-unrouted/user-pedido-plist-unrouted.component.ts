import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPedidoPage, IUsuario } from 'src/app/model/model.interfaces';
import { PedidoService } from './../../../service/Pedido.service';
import { SesionService } from './../../../service/Sesion.service';

@Component({
  selector: 'app-user-pedido-plist-unrouted',
  templateUrl: './user-pedido-plist-unrouted.component.html',
  styleUrls: ['./user-pedido-plist-unrouted.component.css']
})
export class UserPedidoPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
 

  page: IPedidoPage | undefined;
  usuario: IUsuario | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 8, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;

  constructor(
    private PedidoService: PedidoService,
    private SesionService: SesionService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getCompras();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getCompras();
        }
      }
    })
  }

  getCompras(): void {
    this.SesionService.getSessionUser()?.subscribe({
      next: (usuario: IUsuario) => {
        this.usuario = usuario;
        const rows: number = this.paginatorState.rows ?? 0;
        const page: number = this.paginatorState.page ?? 0;
        this.PedidoService.getPage(rows, page, this.orderField, this.orderDirection, this.usuario?.id).subscribe({
          next: (page: IPedidoPage) => {
            this.page = page;
            this.paginatorState.pageCount = this.page.totalPages;
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open('Error al obtener los pedidos', 'OK', { duration: 3000 });
          }
        });
      }
    })
    }
  
  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getCompras();
  }
  volverAtras() {
    this.router.navigate(['/home']);
  }

}