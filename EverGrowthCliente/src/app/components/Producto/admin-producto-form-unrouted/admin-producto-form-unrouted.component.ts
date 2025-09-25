import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ICategoria, IProducto, formOperation } from 'src/app/model/model.interfaces';
import { ProductoService } from './../../../service/Producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCategoriaSelectionUnroutedComponent } from '../../Categoria/admin-categoria-selection-unrouted/admin-categoria-selection-unrouted.component';
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
  selector: 'app-admin-producto-form-unrouted',
  templateUrl: './admin-producto-form-unrouted.component.html',
  styleUrls: ['./admin-producto-form-unrouted.component.css'],
  providers: [MessageService]

})
export class AdminProductoFormUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';
  productForm!: FormGroup;
  producto: IProducto = { categoria: {} } as IProducto;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;
  url?: string;
  selectedImageUrl: string | undefined;


  constructor(
    private FormBuilder: FormBuilder,
    private ProductoService: ProductoService,
    private oRouter: Router,
    private MatSnackBar: MatSnackBar,
    private oDialogService: DialogService,
    private MediaService: MediaService

  ) { this.initializeForm(this.producto); }

  initializeForm(producto: IProducto) {
    const categoriaID = producto.categoria ? producto.categoria.id : null;

    this.productForm = this.FormBuilder.group({

      id: [producto.id],
      nombre: [producto.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255), startWithCapitalLetter()]],
      precio: [producto.precio, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      iva: [producto.iva, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: [producto.stock, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      descripcion: [producto.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(2048), startWithCapitalLetter()]],
      imagen: [producto.imagen, Validators.required],
      categoria: this.FormBuilder.group({
        id: [categoriaID]
      }),

    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.ProductoService.getOne(this.id).subscribe({

        next: (data: IProducto) => {
          this.producto = data;
          this.initializeForm(this.producto);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.MatSnackBar.open('Error al leer productos', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.producto);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.productForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.operation == 'NEW') {
        this.ProductoService.newOne(this.productForm.value).subscribe({
          next: (data: IProducto) => {
            this.producto = data;
            this.initializeForm(this.producto);
            this.MatSnackBar.open('El producto se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'producto', 'view', this.producto]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El producto no se ha creado correctamente', '', { duration: 2000 });
          }
        })

      } else {
        this.ProductoService.updateOne(this.productForm.value).subscribe({
          next: (data: IProducto) => {
            this.producto = data;
            this.initializeForm(this.producto);
            this.MatSnackBar.open('El producto se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'producto', 'view', this.producto.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.MatSnackBar.open('El producto no se ha actualizado correctamente', '', { duration: 2000 });
          }
        });

      }
    }
  }

  onShowCategoriaSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminCategoriaSelectionUnroutedComponent, {
      header: 'Selecciona una Categoria',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((categoria: ICategoria) => {
      if (categoria) {
        this.producto.categoria = categoria;
        this.productForm.controls['categoria'].patchValue({ id: categoria.id });
      }
    });
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

        // Asignamos la URL al formulario
        this.productForm.controls['imagen'].patchValue(newUrl);

        // Actualizamos el producto completo
        if (this.producto.id) {
          this.ProductoService.updateOne(this.productForm.value).subscribe({
            next: (updatedProducto) => {
              this.producto = updatedProducto;
              this.MatSnackBar.open('Imagen actualizada correctamente', '', { duration: 2000 });
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al actualizar el producto:', err);
              this.MatSnackBar.open('Error al guardar la imagen en el producto', '', { duration: 2000 });
            }
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al subir la imagen:', err);
        this.MatSnackBar.open('Error al subir la imagen', '', { duration: 2000 });
      }
    });
  }



}
