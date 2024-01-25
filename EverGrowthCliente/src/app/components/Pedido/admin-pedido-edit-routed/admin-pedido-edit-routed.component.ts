import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-pedido-edit-routed',
  templateUrl: './admin-pedido-edit-routed.component.html',
  styleUrls: ['./admin-pedido-edit-routed.component.css']
})
export class AdminPedidoEditRoutedComponent implements OnInit {

 
  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
