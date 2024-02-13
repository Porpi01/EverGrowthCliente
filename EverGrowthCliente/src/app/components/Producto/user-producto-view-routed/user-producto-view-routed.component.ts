import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { IProducto } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-user-producto-view-routed',
  templateUrl: './user-producto-view-routed.component.html',
  styleUrls: ['./user-producto-view-routed.component.css']
})
export class UserProductoViewRoutedComponent implements OnInit {

  id: number = 0;
  actualizarValoraciones: Subject<boolean> = new Subject<boolean>();



  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1"); 
   
    
  console.log( "Id producto" + this.id);


   }
   onValoracionChange(oProducto: Boolean) {
    this.actualizarValoraciones.next(true);
  }


  ngOnInit() {
  }
}