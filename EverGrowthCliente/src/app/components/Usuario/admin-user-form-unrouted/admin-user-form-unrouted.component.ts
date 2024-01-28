import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { IUsuario, formOperation } from 'src/app/model/model.interfaces';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { UsuarioService } from './../../../service/Usuario.service';

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
  selector: 'app-admin-user-form-unrouted',
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.css'],
  providers: [MessageService, ]
})


export class AdminUserFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; 
  userForm!: FormGroup;
  usuario: IUsuario = {} as IUsuario;
  status: HttpErrorResponse | null = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UsuarioService: UsuarioService,
    private oRouter: Router,
    private MatSnackBar: MatSnackBar

  ) { this.initializeForm(this.usuario);}

  initializeForm(usuario: IUsuario) {
    this.userForm = this.FormBuilder.group({
      id: [usuario.id],
      nombre: [usuario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],
      apellido1: [usuario.apellido1, [Validators.required, Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      apellido2: [usuario.apellido2,[ Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      email: [usuario.email, [Validators.required, Validators.email]],
      telefono: [usuario.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]],
      direccion: [usuario.direccion, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      username: [usuario.username, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      rol: [usuario.rol, Validators.required]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.UsuarioService.getOne(this.id).subscribe({
        next: (data: IUsuario) => {
          this.usuario = data;
          this.initializeForm(this.usuario);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.MatSnackBar.open('Error leyendo usuarios', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.usuario);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      if (this.operation == 'NEW') {
        console.log(this.operation);
        this.UsuarioService.newOne(this.userForm.value).subscribe({
          next: (data: IUsuario) => {
            this.usuario = data;
            console.log(this.usuario);
            this.initializeForm(this.usuario);
            this.MatSnackBar.open('El usuario se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'usuario', 'view', this.usuario]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El usuario no se ha creado correctamente', '', { duration: 2000 });
          }
        })

      } else {
        this.UsuarioService.updateOne(this.userForm.value).subscribe({
          next: (data: IUsuario) => {
            this.usuario = data;
            this.initializeForm(this.usuario);
            this.MatSnackBar.open('El usuario se ha actualizado a correctamente','', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'usuario', 'view', this.usuario.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('Falló la actualización', '', { duration: 2000 });
          }
        });
        
      }
    }
  }

}
