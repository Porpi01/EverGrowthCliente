import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-carrito-edit-routed',
  templateUrl: './admin-carrito-edit-routed.component.html',
  styleUrls: ['./admin-carrito-edit-routed.component.css']
})
export class AdminCarritoEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
