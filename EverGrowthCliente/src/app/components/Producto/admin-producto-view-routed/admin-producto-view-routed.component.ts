import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-producto-view-routed',
  templateUrl: './admin-producto-view-routed.component.html',
  styleUrls: ['./admin-producto-view-routed.component.css']
})
export class AdminProductoViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
