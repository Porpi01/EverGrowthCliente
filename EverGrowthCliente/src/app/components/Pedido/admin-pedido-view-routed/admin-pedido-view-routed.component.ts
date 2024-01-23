import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-pedido-view-routed',
  templateUrl: './admin-pedido-view-routed.component.html',
  styleUrls: ['./admin-pedido-view-routed.component.css']
})
export class AdminPedidoViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }


}
