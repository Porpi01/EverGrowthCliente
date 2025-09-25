import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";
import { formOperation, IValoracion, IUsuario, IProducto } from "src/app/model/model.interfaces";
import { ValoracionService } from "src/app/service/Valoracion.service";
import { AdminUserSelectionUnroutedComponent } from "../../Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component";
import { AdminProductoSelectionUnroutedComponent } from "../../Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS } from "@angular/material/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-admin-valoracion-form-unrouted',
  templateUrl: './admin-valoracion-form-unrouted.component.html',
  styleUrls: ['./admin-valoracion-form-unrouted.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    MessageService
  ],
})
export class AdminValoracionFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; 


  valoracionForm!: FormGroup;
  valoracion: IValoracion = { fecha: new Date(), user: {}, producto: {} } as IValoracion;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;



  constructor(
    private formBuilder: FormBuilder,
    private valoracionService: ValoracionService,
    private router: Router,
    private dialogService: DialogService,
    private MessageService: MessageService,
    private MatSnackBar: MatSnackBar
  ) {
    this.initializeForm(this.valoracion);
  }

  initializeForm(valoracion: IValoracion) {
    this.valoracionForm = this.formBuilder.group({
      id: [valoracion.id],
      titulo: [valoracion.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      fecha: [valoracion.fecha, [Validators.required]],
      mensaje: [valoracion.mensaje, [Validators.required , Validators.minLength(3), Validators.maxLength(2048), startWithCapitalLetter()]],
      user: this.formBuilder.group({
        id: [valoracion.user.id, Validators.required]
      }),
      producto: this.formBuilder.group({
        id: [valoracion.producto.id, Validators.required]
      })
    });
  }
  
  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.valoracionService.getOne(this.id).subscribe({
        next: (data: IValoracion) => {
          this.valoracion = data;
          this.initializeForm(this.valoracion);

        },
        error: (error: HttpErrorResponse) => {
          this.status = error;

          this.MatSnackBar.open('No se ha podido actualizar la valoración', 'Cerrar', {
            duration: 2000,        
          });
        }
      });
    } else {
      this.initializeForm(this.valoracion);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.valoracionForm.controls[controlName].hasError(errorName);
  }

 
  onSubmit() {
    if (this.valoracionForm.valid) {
      if (this.operation == 'NEW') {
        this.valoracionService.newOne(this.valoracionForm.value).subscribe({
       
          next: (data: IValoracion) => {
            this.valoracion = {"user": {}, "producto": {}} as IValoracion;
            this.initializeForm(this.valoracion);

            this.MatSnackBar.open('La creación de la valoración ha sido exitosa', 'Cerrar', {
              duration: 2000,});            
                      
            this.router.navigate(['/admin', 'valoracion', 'view', data]);
    
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('La creación de la valoración no ha sido exitosa', 'Cerrar', {
              duration: 2000,
        
            });          }
        });
      } else {
        this.valoracionService.updateOne(this.valoracionForm.value).subscribe({
          next: (data: IValoracion) => {
            this.valoracion = data;
            this.initializeForm(this.valoracion);


            this.MatSnackBar.open('La valoración se ha actualizado correctamente', 'Cerrar', {
              duration: 2000,
         
            });           
             this.router.navigate(['/admin', 'valoracion', 'view', this.valoracion.id]);
          
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('La valoración no se ha actualizado', 'Cerrar', {
              duration: 2000,
              panelClass: ['snackbar-error']
            });            
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
        this.valoracion.user = user;
        this.valoracionForm.controls['user'].patchValue({ id: user.id });
      }
    });
  }

  onShowProductosSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminProductoSelectionUnroutedComponent, {
      header: 'Select a Producto',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((producto: IProducto) => {
      if (producto) {
        this.valoracion.producto = producto;
        this.valoracionForm.controls['producto'].patchValue({ id: producto.id });
      }
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.valoracionForm.get('fecha')!.setValue(event.value);
  }

}

