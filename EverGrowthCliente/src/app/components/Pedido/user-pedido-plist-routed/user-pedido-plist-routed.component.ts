import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-pedido-plist-routed',
  templateUrl: './user-pedido-plist-routed.component.html',
  styleUrls: ['./user-pedido-plist-routed.component.css']
})
export class UserPedidoPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  id_usuario: number;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id_usuario = parseInt(this.activatedRoute.snapshot.paramMap.get("idusuario") || "0");
  }

  ngOnInit() {
  }

}

