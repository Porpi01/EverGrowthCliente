import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-categoria-edit-routed',
  templateUrl: './admin-categoria-edit-routed.component.html',
  styleUrls: ['./admin-categoria-edit-routed.component.css']
})
export class AdminCategoriaEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }


}
