import { Component, Input, OnInit } from '@angular/core';
import { CategoriaService } from './../../../service/Categoria.service';
import { ICategoria, formOperation } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';

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
      nombre: [categoria.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
  
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
          this.snackBar.open('Error reading categoria from server', '', { duration: 2000 });
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
            this.snackBar.open('The categoria create has been successful', '', { duration: 2000 });
            console.log(this.categoria.id);

            this.router.navigate(['/admin', 'categoria', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('The categoria create hasn\'t been successful', '', { duration: 2000 });
          }
        });
      } else {
        this.CategoriaService.updateOne(this.categoriaForm.value).subscribe({
          next: (data: ICategoria) => {
            this.categoria = data;
            this.initializeForm(this.categoria);
            this.snackBar.open('The categoria has been updated successfully', '', { duration: 2000 });
            this.router.navigate(['/admin', 'categoria', 'view', this.categoria.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Failed to update the categoria', '', { duration: 2000 });
          }
        });
      }
    }
  }

  }

 


  


