import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-carrito-view-routed',
  templateUrl: './user-carrito-view-routed.component.html',
  styleUrls: ['./user-carrito-view-routed.component.css']
})
export class UserCarritoViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private ActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.ActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  
  }

}
