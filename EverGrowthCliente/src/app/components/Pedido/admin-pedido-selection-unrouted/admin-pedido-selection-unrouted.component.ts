import { Component, Input, OnInit } from '@angular/core';
import { IPedido, IPedidoPage } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { PedidoService } from './../../../service/Pedido.service';

@Component({
  selector: 'app-admin-pedido-selection-unrouted',
  templateUrl: './admin-pedido-selection-unrouted.component.html',
  styleUrls: ['./admin-pedido-selection-unrouted.component.css']
})
export class AdminPedidoSelectionUnroutedComponent implements OnInit {

  @Input() id_usuario: number = 0;

  oPage: IPedidoPage | undefined;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  pedidos: IPedido[] = [];
  pedidoToRemove: IPedido | null = null;
  ref: DynamicDialogRef | undefined;
  filteredUsers: IPedido[] | undefined;
  selectedUsers: IPedido | undefined;
  formGroup: FormGroup;
  value: string = '';

  constructor(
    private PedidoService: PedidoService,
    private dialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) {
    this.formGroup = new FormGroup({
      selectedCategoria: new FormControl<any | null>(null)
    });
  }

  ngOnInit() {
    this.getPage();
  }



  getPage(): void {
    this.PedidoService
      .getPage(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.id_usuario

      )
      .subscribe({
        next: (data: IPedidoPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.pedidos = data.content;
          console.log(this.oPaginatorState);
          console.log(this.pedidos);
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

  onSelectPedido(pedido: IPedido) {
    this.oDynamicDialogRef.close(pedido);
  }

}
