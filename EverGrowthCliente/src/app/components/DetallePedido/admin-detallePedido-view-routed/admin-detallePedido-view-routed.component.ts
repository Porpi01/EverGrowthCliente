import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-detallePedido-view-routed',
  templateUrl: './admin-detallePedido-view-routed.component.html',
  styleUrls: ['./admin-detallePedido-view-routed.component.css']
})
export class AdminDetallePedidoViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }


}
