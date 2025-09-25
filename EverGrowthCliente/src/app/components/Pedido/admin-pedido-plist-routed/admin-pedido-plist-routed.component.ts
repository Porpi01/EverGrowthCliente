import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { PedidoService } from './../../../service/Pedido.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-pedido-plist-routed',
  templateUrl: './admin-pedido-plist-routed.component.html',
  styleUrls: ['./admin-pedido-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminPedidoPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  items: MenuItem[] | undefined;
  bLoading: boolean = false;
  loadingProgress: number = 0;
  id_usuario: number = 0;
  displayDialog: boolean = false;
  constructor(
    private PedidoService: PedidoService,
    private router: Router,
    private MessageService: MessageService,
    private ConfirmationService: ConfirmationService,
    private ActivatedRoute: ActivatedRoute,
    private MatSnackBar: MatSnackBar


  ) {
    this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
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
        command: () => this.router.navigate(['admin/pedido/new'])
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
        this.PedidoService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MatSnackBar.open(`Hay ${oResponse} pedidos.`, 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MatSnackBar.open(`Error al generar pedidos: ${oError.message}`, 'Cerrar', { duration: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty() {
    this.PedidoService.empty().subscribe({
      next: (oResponse: number) => {
        this.MatSnackBar.open(`Hay ${oResponse} pedidos.`, 'Cerrar', {duration: 2000,});

        this.bLoading = false;
        this.forceReload.next(true);
        this.displayDialog = false; 
      },
      error: (oError: HttpErrorResponse) => {
        console.error('Error response:', oError);
        this.MatSnackBar.open(`Error al eliminar los pedidos: ${oError.message}`, 'Cerrar', { duration: 2000,});
        this.bLoading = false;
      },
    });
  }

}
