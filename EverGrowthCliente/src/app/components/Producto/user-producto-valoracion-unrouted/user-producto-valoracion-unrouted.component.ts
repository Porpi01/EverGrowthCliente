import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { IValoracion, IUsuario, IProducto } from 'src/app/model/model.interfaces';
import { ValoracionService } from 'src/app/service/Valoracion.service';
import { startWithCapitalLetter } from '../admin-producto-form-unrouted/admin-producto-form-unrouted.component';
import { UsuarioService } from './../../../service/Usuario.service';
import { ProductoService } from './../../../service/Producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-producto-valoracion-unrouted',
  templateUrl: './user-producto-valoracion-unrouted.component.html',
  styleUrls: ['./user-producto-valoracion-unrouted.component.css']
})
export class UserProductoValoracionUnroutedComponent implements OnInit {


  valoracionForm!: FormGroup;
  valoracion: IValoracion = { fecha: new Date(Date.now()), user: { id: 0 }, producto: { id: 0 } } as IValoracion;

  id_usuario: number | undefined;
  id_producto: number | undefined;
  usuario: IUsuario | undefined;
  producto: IProducto | undefined;
  status: HttpErrorResponse | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private valoracionService: ValoracionService,
    private UsuarioService: UsuarioService,
    private ProductoService: ProductoService,
    public oDynamicDialogRef: DynamicDialogRef,
    public oDynamicDialogConfig: DynamicDialogConfig,
    public DialogService: DialogService,
    private MatSnackBar: MatSnackBar

  ) {
    this.id_usuario = this.oDynamicDialogConfig.data.id_usuario;
    this.id_producto = this.oDynamicDialogConfig.data.id_producto;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.valoracionForm.controls[controlName].hasError(errorName);
  }

  ngOnInit() {

    if (this.id_usuario !== undefined) {
      this.UsuarioService.getOne(this.id_usuario).subscribe({
        next: (usuario: IUsuario) => {
          this.usuario = usuario;
        },
        error: (error) => {
          this.status = error
          this.MatSnackBar.open('Error al obtener el usuario', 'Cerrar', { duration: 2000 });
        }
      });

    }

    if (this.id_producto !== undefined) {
      this.ProductoService.getOne(this.id_producto).subscribe({
        next: (producto: IProducto) => {
          this.producto = producto;
        },
        error: (error) => {
          this.status = error
          this.MatSnackBar.open('Error al obtener el producto', 'Cerrar', { duration: 2000 });
        }
      });
    }

    this.initializeForm(this.valoracion);

  }
  initializeForm(valoracion: IValoracion) {
    this.valoracionForm = this.formBuilder.group({
      id: [valoracion.id],
      titulo: [valoracion.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      fecha: [new Date(valoracion.fecha), [Validators.required]],
      mensaje: [valoracion.mensaje, [Validators.required, Validators.minLength(3), Validators.maxLength(2048), startWithCapitalLetter()]],
      user: this.formBuilder.group({
        id: [this.id_usuario, Validators.required]
      }),
      producto: this.formBuilder.group({
        id: [this.id_producto, Validators.required]

      }),

    });

  }
  onSubmit() {

    const valoracion = this.valoracionForm.value;

    this.valoracionService.newOne(valoracion).subscribe({
      next: (data: IValoracion) => {
        this.MatSnackBar.open('Valoración creada', 'Cerrar', { duration: 2000 });
        this.oDynamicDialogRef.close(data);

      },
      error: (err) => {
        this.status = err;
        this.MatSnackBar.open('Error al crear la valoración', 'Cerrar', { duration: 2000 });
      }
    });

  }


  onCancel() {
    this.oDynamicDialogRef.close();
  }


}
