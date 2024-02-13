import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SesionService } from './../../../service/Sesion.service';
import { CryptoService } from './../../../service/Crypto.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private SesionService: SesionService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router,
    private CryptoService: CryptoService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.SesionService.login(this.loginForm.value.username, this.CryptoService.getSHA256(this.loginForm.value.password)).subscribe({
        next: (data: string) => {
          
          this.SesionService.setToken(data);
          this.SesionService.emit({ type: 'login' });
          this.oMatSnackBar.open("Login successful.", '', { duration: 2000 });
          
            this.oRouter.navigate(['/home']);

    
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error in login operation.", '', { duration: 2000 });
        }
      });
    }
  }
  onReset() {
    this.loginForm.reset();
  }

  loginAdmin() {
    this.loginForm.setValue({

      username: 'anita17',
      password: 'EverGrowth'

    })
  }

  loginUser() {
    this.loginForm.setValue({
      username: 'moni01',
      password: 'EverGrowth'
    })
  }
}
