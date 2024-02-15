import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { DetallePedidoService } from './../../../service/DetallePedido.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-detallePedido-plist-routed',
  templateUrl: './admin-detallePedido-plist-routed.component.html',
  styleUrls: ['./admin-detallePedido-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})

export class AdminDetallePedidoPlistRoutedComponent implements OnInit {


  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  id_pedido: number = 0;
  id_producto: number = 0;
  displayDialog: boolean = false;
  constructor(
    private DetallePedidoService: DetallePedidoService,
    private router: Router,
    private MessageService: MessageService,
    private ConfirmationService: ConfirmationService,
    private ActivatedRoute: ActivatedRoute,
    private MatSnackBar : MatSnackBar


  ) {
    this.id_pedido = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idpedido") ?? "0");
    this.id_producto = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idproducto") ?? "0");
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
        command: () => this.router.navigate(['admin/detallePedido/new'])
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
        this.DetallePedidoService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Hay ' + oResponse + ' detalles pedidos', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error al generar detalles pedidos: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.DetallePedidoService.empty().subscribe({
      next: (oResponse: number) => {
        console.log('Success response:', oResponse);
        this.MatSnackBar.open(`Hay ${oResponse} detalles pedidos.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar los detalles pedidos: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }


}
