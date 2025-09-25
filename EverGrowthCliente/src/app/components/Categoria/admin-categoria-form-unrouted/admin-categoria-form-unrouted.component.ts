import { Component, Input, OnInit } from '@angular/core';
import { CategoriaService } from './../../../service/Categoria.service';
import { ICategoria, formOperation } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MediaService } from './../../../service/Media.service';

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
  url?: string;
  selectedImageUrl: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private CategoriaService: CategoriaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private MediaService: MediaService
  ) {
    this.initializeForm(this.categoria);
  }

  initializeForm(categoria: ICategoria) {
    this.categoriaForm = this.formBuilder.group({
      id: [categoria.id],
      nombre: [categoria.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255),startWithCapitalLetter()]],
      imagen: [categoria.imagen, Validators.required],
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
      // Si hay imagen subida, actualizar el form antes de enviar
      if (this.selectedImageUrl) {
        this.categoriaForm.controls['imagen'].patchValue(this.selectedImageUrl);
      }

      this.CategoriaService.newOne(this.categoriaForm.value).subscribe({
        next: (data: ICategoria) => {
          this.categoria = data;
          // Aseguramos que la categoría creada tenga la imagen correcta
          if (this.selectedImageUrl) {
            this.categoria.imagen = this.selectedImageUrl;
          }

          this.initializeForm(this.categoria);
          this.snackBar.open('La categoría se ha creado', '', { duration: 2000 });

          this.router.navigate(['/admin', 'categoria', 'view', this.categoria.id]);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('La categoría no se ha creado', '', { duration: 2000 });
        }
      });
    } else {
      // UPDATE
      if (this.selectedImageUrl) {
        this.categoriaForm.controls['imagen'].patchValue(this.selectedImageUrl);
      }

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

 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  this.MediaService.uploadFile(formData).subscribe({
    next: (response) => {
      const newUrl = response.url;
      this.selectedImageUrl = newUrl;
      this.categoria.imagen = newUrl;
      this.categoriaForm.controls['imagen'].patchValue(newUrl);

      if (this.categoria.id) {
        // Actualizamos la categoría en el backend
        this.CategoriaService.updateOne(this.categoria).subscribe({
          next: (updatedCategoria) => {
            this.categoria = updatedCategoria;
            this.snackBar.open('Imagen actualizada correctamente', '', { duration: 2000 });
          },
          error: (err) => {
            console.error('Error al actualizar categoría:', err);
            this.snackBar.open('Error al guardar la imagen en la categoría', '', { duration: 2000 });
          }
        });
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error al subir la imagen:', err);
      this.snackBar.open('Error al subir la imagen', '', { duration: 2000 });
    }
  });
}



}







