import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {  IValoracion, IUsuario, IProducto } from 'src/app/model/model.interfaces';
import { ValoracionService } from 'src/app/service/Valoracion.service';
import { UsuarioService } from './../../../service/Usuario.service';
import { ProductoService } from './../../../service/Producto.service';


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
    private MessageService: MessageService,
    public oDynamicDialogRef: DynamicDialogRef,
    public oDynamicDialogConfig: DynamicDialogConfig,
    public DialogService: DialogService
  ) {
    this.id_usuario = this.oDynamicDialogConfig.data.id_usuario;
    console.log(this.id_usuario)
    this.id_producto = this.oDynamicDialogConfig.data.id_producto;
    console.log(this.id_producto)}
   
    public hasError = (controlName: string, errorName: string) => {
      return this.valoracionForm.controls[controlName].hasError(errorName);
    }

  ngOnInit() {
    
if(this.id_usuario !== undefined) {
  this.UsuarioService.getOne(this.id_usuario).subscribe({
    next:(usuario: IUsuario) => {
      this.usuario = usuario;
      console.log(this.usuario)
    },
    error: (error) => {
      this.status = error
      this.MessageService.add({ severity: 'error',detail: 'No se puede crear la valoración',  life: 2000});
    }
  });

}

if(this.id_producto !== undefined) {
  this.ProductoService.getOne(this.id_producto).subscribe({
    next:(producto: IProducto) => {
      this.producto = producto;
      console.log(this.producto)
    },
    error: (error) => {
      this.status = error
      this.MessageService.add({ severity: 'error', detail: 'Aceptar',  life: 2000});
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
    valoracion.user = this.usuario;
    console.log( "iD USUARIO: " + valoracion.user)
    valoracion.producto = this.producto;
    console.log("ID PRODUCTO" + valoracion.producto)

    this.valoracionService.newOne(valoracion).subscribe({
      next: (data: IValoracion) => {
        this.MessageService.add({ severity: 'success', detail: 'Valoración creada', life: 2000 });
        this.oDynamicDialogRef.close(data);
      },
      error: (err) => {
        this.status = err;
        this.MessageService.add({ severity: 'error', detail: 'Aceptar', life: 2000 });
      }
    });
  
}


    onCancel() {
      this.oDynamicDialogRef.close();
    }
    
}