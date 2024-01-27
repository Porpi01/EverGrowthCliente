import { Component, Input, OnInit } from '@angular/core';
import { IDetallePedido, IPedido, IProducto, formOperation } from 'src/app/model/model.interfaces';
import { DetallePedidoService } from './../../../service/DetallePedido.service';
import { AdminPedidoSelectionUnroutedComponent } from '../../Pedido/admin-pedido-selection-unrouted/admin-pedido-selection-unrouted.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AdminProductoSelectionUnroutedComponent } from '../../Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component';

@Component({
  selector: 'app-admin-detallePedido-form-unrouted',
  templateUrl: './admin-detallePedido-form-unrouted.component.html',
  styleUrls: ['./admin-detallePedido-form-unrouted.component.css']
})
export class AdminDetallePedidoFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; 




  pedidoForm!: FormGroup;
  detallePedido: IDetallePedido = { productos: {}, pedidos: {}} as IDetallePedido;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private DetallePedidoService: DetallePedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.initializeForm(this.detallePedido);
  }

  initializeForm(detallePedido: IDetallePedido) {
    this.pedidoForm = this.formBuilder.group({
      id: [detallePedido.id],
      cantidad: [detallePedido.cantidad, [Validators.required]],
      precio_unitario: [detallePedido.precio_unitario, [Validators.required]],
      productos: this.formBuilder.group({
        id: [detallePedido.productos?.id, Validators.required]
      }),
      pedidos: this.formBuilder.group({
        id: [detallePedido.pedidos?.id, Validators.required]
      }),
    
    });
  }
  
  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.DetallePedidoService.getOne(this.id).subscribe({
        next: (data: IDetallePedido) => {
          this.detallePedido = data;
          this.initializeForm(this.detallePedido);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error reading detalle pedido from server', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.detallePedido);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.pedidoForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      if (this.operation == 'NEW') {
        console.log(this.pedidoForm.value);
        this.DetallePedidoService.newOne(this.pedidoForm.value).subscribe({
       
          next: (data: IDetallePedido) => {
            this.detallePedido = {"productos": {}, "pedidos":{}} as IDetallePedido;
            this.initializeForm(this.detallePedido);
            this.snackBar.open('The detalle pedido create has been successful', '', { duration: 2000 });
            console.log(this.detallePedido.id);

            this.router.navigate(['/admin', 'detallePedido', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('The user create hasn\'t been successful', '', { duration: 2000 });
          }
        });
      } else {
        this.DetallePedidoService.updateOne(this.pedidoForm.value).subscribe({
          next: (data: IDetallePedido) => {
            this.detallePedido = data;
            this.initializeForm(this.detallePedido);
            this.snackBar.open('The detalle pedido has been updated successfully', '', { duration: 2000 });
            this.router.navigate(['/admin', 'detallePedido', 'view', this.detallePedido.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Failed to update the detalle pedido', '', { duration: 2000 });
          }
        });
      }
    }
  }

  onShowPedidoSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminPedidoSelectionUnroutedComponent, {
      header: 'Select a Pedido',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((pedidos: IPedido) => {
      if (pedidos) {
        this.detallePedido.pedidos = pedidos;
        this.pedidoForm.controls['pedidos'].patchValue({ id: pedidos.id });
      }
    });
  }

  onShowProductoSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminProductoSelectionUnroutedComponent, {
      header: 'Select a Producto',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((productos: IProducto) => {
      if (productos) {
        this.detallePedido.productos = productos;
        this.pedidoForm.controls['productos'].patchValue({ id: productos.id });
      }
    });
  }

 


  }


