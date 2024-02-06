import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ProductoService } from './../../../service/Producto.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


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
  constructor(
    private ProductoService: ProductoService,
    private router: Router,
    private MessageService: MessageService,
    private ConfirmationService: ConfirmationService,
    private ActivatedRoute: ActivatedRoute,

  ) { 
    this.id_categoria = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idcategoria") ?? "0");

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Borrar',
        icon: "fa-solid fa-circle-minus",
        command: () => this.doEmpty(new Event('click'))

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
            this.MessageService.add({ severity: 'success', detail: 'Hay ' + oResponse + ' productos', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generando productos: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    console.log('doEmpty called');

    this.ConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: '¿Seguro que quieres eliminar los productos?',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        console.log('Accept block reached');
        this.ProductoService.empty().subscribe({
          next: (oResponse: number) => {
            console.log('Success response:', oResponse);
            this.MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Hay ${oResponse} productos.`,
              life: 2000
            });

            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            console.error('Error response:', oError);
            this.MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error borrando productos: ${oError.message}`,
              life: 2000
            });

            this.bLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Reject block reached');
        this.MessageService.add({
          severity: 'info',
          detail: 'Operación cancelada',
          life: 2000
        });

      },
    });
  }

}
