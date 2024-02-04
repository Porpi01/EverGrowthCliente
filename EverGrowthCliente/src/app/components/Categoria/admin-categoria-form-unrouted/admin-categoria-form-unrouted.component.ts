import { Component, Input, OnInit } from '@angular/core';
import { CategoriaService } from './../../../service/Categoria.service';
import { ICategoria, formOperation } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';

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
  selector: 'app-admin-categoria-form-unrouted',
  templateUrl: './admin-categoria-form-unrouted.component.html',
  styleUrls: ['./admin-categoria-form-unrouted.component.css']
})
export class AdminCategoriaFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';


  categoriaForm!: FormGroup;
  categoria: ICategoria = {} as ICategoria;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private CategoriaService: CategoriaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.initializeForm(this.categoria);
  }

  initializeForm(categoria: ICategoria) {
    this.categoriaForm = this.formBuilder.group({
      id: [categoria.id],
      nombre: [categoria.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],

    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.CategoriaService.getOne(this.id).subscribe({
        next: (data: ICategoria) => {
          this.categoria = data;
          this.initializeForm(this.categoria);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al leer la categoría del servidor', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.categoria);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.categoriaForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      if (this.operation == 'NEW') {
        console.log(this.categoriaForm.value);
        this.CategoriaService.newOne(this.categoriaForm.value).subscribe({

          next: (data: ICategoria) => {
            this.categoria = data;
            this.initializeForm(this.categoria);
            this.snackBar.open('La categoría se ha creado', '', { duration: 2000 });
            console.log(this.categoria.id);

            this.router.navigate(['/admin', 'categoria', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('La categoría no se ha creado', '', { duration: 2000 });
          }
        });
      } else {
        this.CategoriaService.updateOne(this.categoriaForm.value).subscribe({
          next: (data: ICategoria) => {
            this.categoria = data;
            this.initializeForm(this.categoria);
            this.snackBar.open('La categoría se ha actualizado', '', { duration: 2000 });
            this.router.navigate(['/admin', 'categoria', 'view', this.categoria.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Falló la actualización', '', { duration: 2000 });
          }
        });
      }
    }
  }

}







