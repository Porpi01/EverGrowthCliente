import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPedido, IProducto, IProductoPage } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { PedidoService } from './../../../service/Pedido.service';
import { SesionService } from 'src/app/service/Sesion.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(
  
  ) { }

  ngOnInit() {
  
  }


}