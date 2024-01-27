import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-producto-edit-routed',
  templateUrl: './admin-producto-edit-routed.component.html',
  styleUrls: ['./admin-producto-edit-routed.component.css']
})
export class AdminProductoEditRoutedComponent implements OnInit {
 
  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
