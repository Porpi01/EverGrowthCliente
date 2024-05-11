import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/service/Crypto.service';
import { UsuarioService } from 'src/app/service/Usuario.service';

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
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class RegisterComponent implements OnInit {

 
  registerForm: FormGroup;
  status: HttpErrorResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cryptoService: CryptoService
  ) {
    this.registerForm = this.fb.group({
    
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],
      apellido2: [ '', [Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255),startWithCapitalLetter()]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Agrega validación para la contraseña
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log("Funcionas");
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value }; // Clonamos el objeto para no modificar el original
      formData.password = this.cryptoService.getSHA256(formData.password); // Hasheamos la contraseña

      this.usuarioService.signUp(formData).subscribe({
        next: (userId: number) => {
          console.log(userId);
          this.snackBar.open("Registro exitoso.", '', { duration: 2000 });
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.snackBar.open("Ya existe un usuario con estos datos.", '', { duration: 2000 });
          } else {
            this.snackBar.open("Error en el registro.", '', { duration: 2000 });
          }
        }
      });
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }
}

