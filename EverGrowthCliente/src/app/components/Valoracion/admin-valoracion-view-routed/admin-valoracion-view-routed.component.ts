import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-valoracion-view-routed',
  templateUrl: './admin-valoracion-view-routed.component.html',
  styleUrls: ['./admin-valoracion-view-routed.component.css']
})
export class AdminValoracionViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
