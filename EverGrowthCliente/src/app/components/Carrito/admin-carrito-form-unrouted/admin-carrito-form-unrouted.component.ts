import { Component, Input, OnInit } from '@angular/core';
import { ICarrito, IProducto, IUsuario, formOperation } from 'src/app/model/model.interfaces';
import { CarritoService } from './../../../service/Carrito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AdminUserSelectionUnroutedComponent } from '../../Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { AdminProductoSelectionUnroutedComponent } from '../../Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component';

@Component({
  selector: 'app-admin-carrito-form-unrouted',
  templateUrl: './admin-carrito-form-unrouted.component.html',
  styleUrls: ['./admin-carrito-form-unrouted.component.css']
})
export class AdminCarritoFormUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';




  carritoForm!: FormGroup;
  carrito: ICarrito = { user: {}, producto: {} } as ICarrito;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private CarritoService: CarritoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.initializeForm(this.carrito);
  }

  initializeForm(carrito: ICarrito) {
    this.carritoForm = this.formBuilder.group({
      id: [carrito.id],
      cantidad: [carrito.cantidad, Validators.required],
      user: this.formBuilder.group({
        id: [carrito.user?.id, Validators.required]
      }),
      producto: this.formBuilder.group({
        id: [carrito.producto?.id, Validators.required]
      })

    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.CarritoService.getOne(this.id).subscribe({
        next: (data: ICarrito) => {
          this.carrito = data;
          this.initializeForm(this.carrito);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al leer el carrito', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.carrito);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.carritoForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.carritoForm.valid) {
      if (this.operation == 'NEW') {
        console.log(this.carritoForm.value);
        this.CarritoService.newOne(this.carritoForm.value).subscribe({

          next: (data: ICarrito) => {
            this.carrito = data;
            this.initializeForm(this.carrito);
            this.snackBar.open('Carrito creado', '', { duration: 2000 });
            console.log(this.carrito.id);

            this.router.navigate(['/admin', 'carrito', 'view', data]);

          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Carrito no creado', '', { duration: 2000 });
          }
        });
      } else {
        this.CarritoService.updateOne(this.carritoForm.value).subscribe({
          next: (data: ICarrito) => {
            this.carrito = data;
            this.initializeForm(this.carrito);
            this.snackBar.open('Carrito actualizado', '', { duration: 2000 });
            this.router.navigate(['/admin', 'carrito', 'view', this.carrito.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Carrito no actualizado', '', { duration: 2000 });
          }
        });
      }
    }
  }

  onShowUsersSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Selecciona un Usuario',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((user: IUsuario) => {
      if (user) {
        this.carrito.user = user;
        this.carritoForm.controls['user'].patchValue({ id: user.id });
      }
    });
  }

  onShowProductosSelection() {
    this.oDynamicDialogRef = this.dialogService.open(AdminProductoSelectionUnroutedComponent, {
      header: 'Selecciona un Producto',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((producto: IProducto) => {
      if (producto) {
        this.carrito.producto = producto;
        this.carritoForm.controls['producto'].patchValue({ id: producto.id });
      }
    });
  }


}
