import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ProductoService } from './../../../service/Producto.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-producto-plist-routed',
  templateUrl: './admin-producto-plist-routed.component.html',
  styleUrls: ['./admin-producto-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminProductoPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  id_categoria: number = 0;
  displayDialog: boolean = false;
  
  constructor(
    private ProductoService: ProductoService,
    private router: Router,
    private MessageService: MessageService,
    private ConfirmationService: ConfirmationService,
    private ActivatedRoute: ActivatedRoute,
    private MatSnackBar : MatSnackBar

  ) { 
    this.id_categoria = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idcategoria") ?? "0");

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Borrar',
        icon: "fa-solid fa-circle-minus",
        command: () => this.displayDialog = true
      },
      {
        label: 'Crear',
        icon: "fa-solid fa-circle-plus",
        command: () => this.router.navigate(['admin/producto/new'])
      }
    ];
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    const totalSteps = 10;
    const stepSize = 100 / totalSteps;
    this.loadingProgress = 0;

    const intervalId = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += stepSize;
      } else {
        clearInterval(intervalId);
        this.ProductoService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open(`Hay ${oResponse} productos.`, 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open(`Error generando productos: ${oError.message}`, 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.ProductoService.empty().subscribe({
      next: (oResponse: number) => {
        console.log('Success response:', oResponse);
        this.MatSnackBar.open(`Hay ${oResponse} productos.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar los productos: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }

}
