import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { formOperation, IPedido, IUsuario } from 'src/app/model/model.interfaces';
import { AdminUserSelectionUnroutedComponent } from '../../Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { PedidoService } from './../../../service/Pedido.service';

@Component({
  selector: 'app-admin-pedido-form-unrouted',
  templateUrl: './admin-pedido-form-unrouted.component.html',
  styleUrls: ['./admin-pedido-form-unrouted.component.css'],
  providers: [],
})
export class AdminPedidoFormUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; 



  pedidoForm!: FormGroup;
  pedido: IPedido = { fecha_pedido: new Date(), fecha_entrega: new Date(), user: {}} as IPedido;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private PedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.initializeForm(this.pedido);
  }

  initializeForm(pedido: IPedido) {
    this.pedidoForm = this.formBuilder.group({
      id: [pedido.id],
      fecha_pedido: [pedido.fecha_pedido, [Validators.required]],
      fecha_entrega: [pedido.fecha_entrega, [Validators.required]],
      estado_pedido: [pedido.estado_pedido, [Validators.required]],
      user: this.formBuilder.group({
        id: [pedido.user?.id, Validators.required]
      }),
    
    });
  }
  
  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.PedidoService.getOne(this.id).subscribe({
        next: (data: IPedido) => {
          this.pedido = data;
          this.initializeForm(this.pedido);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error reading user from server', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.pedido);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.pedidoForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      if (this.operation == 'NEW') {
        console.log(this.pedidoForm.value);
        this.PedidoService.newOne(this.pedidoForm.value).subscribe({
       
          next: (data: IPedido) => {
            this.pedido = {"user": {}} as IPedido;
            this.initializeForm(this.pedido);
            this.snackBar.open('The user create has been successful', '', { duration: 2000 });
            console.log(this.pedido.id);

            this.router.navigate(['/admin', 'pedido', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('The user create hasn\'t been successful', '', { duration: 2000 });
          }
        });
      } else {
        this.PedidoService.updateOne(this.pedidoForm.value).subscribe({
          next: (data: IPedido) => {
            this.pedido = data;
            this.initializeForm(this.pedido);
            this.snackBar.open('The user has been updated successfully', '', { duration: 2000 });
            this.router.navigate(['/admin', 'pedido', 'view', this.pedido.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Failed to update the user', '', { duration: 2000 });
          }
        });
      }
    }
  }

  onShowUsersSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Select a Usuario',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((user: IUsuario) => {
      if (user) {
        this.pedido.user = user;
        this.pedidoForm.controls['user'].patchValue({ id: user.id });
      }
    });
  }

 

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, field: string) {
    if (field === 'fecha_entrega') {
      this.pedidoForm.get('fecha_entrega')!.setValue(event.value);
      console.log(this.pedidoForm.get('fecha_entrega')!.value);
    } else if (field === 'fecha_pedido') {
      this.pedidoForm.get('fecha_pedido')!.setValue(event.value);
      console.log(this.pedidoForm.get('fecha_pedido')!.value);
    }
  }


}
