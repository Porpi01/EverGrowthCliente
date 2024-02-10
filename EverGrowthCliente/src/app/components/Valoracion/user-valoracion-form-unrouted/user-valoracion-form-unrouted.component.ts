import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { formOperation, IValoracion, IUsuario, IProducto } from 'src/app/model/model.interfaces';
import { ValoracionService } from 'src/app/service/Valoracion.service';
import { AdminProductoSelectionUnroutedComponent } from '../../Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component';
import { AdminUserSelectionUnroutedComponent } from '../../Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component';

 
export function startWithCapitalLetter(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;
    if (value && value.charAt(0) !== value.charAt(0).toUpperCase()) {
      return { 'startWithCapitalLetter': { value: control.value } };
    }
    return null;
  };
}


@Component({
  selector: 'app-user-valoracion-form-unrouted',
  templateUrl: './user-valoracion-form-unrouted.component.html',
  styleUrls: ['./user-valoracion-form-unrouted.component.css']
})
export class UserValoracionFormUnroutedComponent implements OnInit {

 @Input() id: number = 1;

  
  @Input() operation: formOperation = 'NEW'; 
  valoracionForm!: FormGroup;
  valoracion: IValoracion = { fecha: new Date(), user: { id: 0 }, producto: {} } as IValoracion;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private valoracionService: ValoracionService,
    private router: Router,
    private MessageService: MessageService,
    private DynamicDialogConfig : DynamicDialogConfig
  ) {

  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      console.log('Valoracion a editar con id: ' + this.valoracion.id);
      this.valoracionService.getOne(this.id).subscribe({
        next: (data: IValoracion) => {
          this.valoracion = data;
          this.initializeForm(this.valoracion);
          console.log(this.valoracion.fecha);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La creación de la valoración no ha sido exitosa' });
        }
      });
    } else {
      this.initializeForm(this.valoracion);
    }
  }

  initializeForm(valoracion: IValoracion) {
    this.valoracionForm = this.formBuilder.group({
      id: [valoracion.id],
      titulo: [valoracion.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      fecha: [valoracion.fecha, [Validators.required]],
      mensaje: [valoracion.mensaje, [Validators.required , Validators.minLength(3), Validators.maxLength(2048), startWithCapitalLetter()]],
      user: this.formBuilder.group({
        id: [valoracion.user?.id, Validators.required]
      }),
      producto: this.formBuilder.group({
        id: [valoracion.producto?.id, Validators.required]
      })
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.valoracionForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.valoracionForm.valid) {
      if (this.operation == 'NEW') {
        this.valoracionService.newOne(this.valoracionForm.value).subscribe({
          next: (data: IValoracion) => {
            this.valoracion = { user: {}, producto: {} } as IValoracion;
            this.initializeForm(this.valoracion);
            this.MessageService.add({ severity: 'success', detail: 'La creación de la valoración ha sido exitosa', life: 2000});
            console.log(this.valoracion.id);
            console.log('Mensaje agregado con éxito al MessageService');
            this.router.navigate(['/usuario', 'valoracion', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail:'La creación de la valoración no ha sido exitosa' });
          }
        });
      } else {
        this.valoracionService.updateOne(this.valoracionForm.value).subscribe({
          next: (data: IValoracion) => {
            this.valoracion = data;
            this.initializeForm(this.valoracion);
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'La valoracion se ha actualizado correctamente' });
            this.router.navigate(['/usuario', 'valoracion', 'view', this.valoracion.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'The valoracion no se ha actualizado'});
          }
        });
      }
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.valoracionForm.get('fecha')!.setValue(event.value);
  }
}
