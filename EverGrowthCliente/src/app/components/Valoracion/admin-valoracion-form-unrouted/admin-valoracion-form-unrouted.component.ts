import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";
import { formOperation, IValoracion, ICategoria, IUsuario, IProducto } from "src/app/model/model.interfaces";
import { ValoracionService } from "src/app/service/Valoracion.service";
import { AdminUserSelectionUnroutedComponent } from "../../Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component";
import { AdminProductoSelectionUnroutedComponent } from "../../Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component";
import { CALENDAR_ES } from 'src/environment/environment';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS } from "@angular/material/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";


@Component({
  selector: 'app-admin-valoracion-form-unrouted',
  templateUrl: './admin-valoracion-form-unrouted.component.html',
  styleUrls: ['./admin-valoracion-form-unrouted.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
})
export class AdminValoracionFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; 

  es = CALENDAR_ES;

  valoracionForm!: FormGroup;
  valoracion: IValoracion = { fecha: new Date(), user: {}, producto: {} } as IValoracion;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private valoracionService: ValoracionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.initializeForm(this.valoracion);
  }

  initializeForm(valoracion: IValoracion) {
    this.valoracionForm = this.formBuilder.group({
      id: [valoracion.id],
      titulo: [valoracion.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      fecha: [valoracion.fecha, [Validators.required]],
      mensaje: [valoracion.mensaje, [Validators.required]],
      user: this.formBuilder.group({
        id: [valoracion.user?.id, Validators.required]
      }),
      producto: this.formBuilder.group({
        id: [valoracion.producto?.id, Validators.required]
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
          this.snackBar.open('Error reading user from server', '', { duration: 2000 });
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
        console.log(this.valoracionForm.value);
        this.valoracionService.newOne(this.valoracionForm.value).subscribe({
       
          next: (data: IValoracion) => {
            this.valoracion = {"user": {}, "producto": {}} as IValoracion;
            this.initializeForm(this.valoracion);
            this.snackBar.open('The user create has been successful', '', { duration: 2000 });
            console.log(this.valoracion.id);

            this.router.navigate(['/admin', 'valoracion', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('The user create hasn\'t been successful', '', { duration: 2000 });
          }
        });
      } else {
        this.valoracionService.updateOne(this.valoracionForm.value).subscribe({
          next: (data: IValoracion) => {
            this.valoracion = data;
            this.initializeForm(this.valoracion);
            this.snackBar.open('The user has been updated successfully', '', { duration: 2000 });
            this.router.navigate(['/admin', 'valoracion', 'view', this.valoracion.id]);
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