import { Component, OnInit } from '@angular/core';
import { IUsuario } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-Footer',
  templateUrl: './Footer.component.html',
  styleUrls: ['./Footer.component.css']
})
export class FooterComponent implements OnInit {

  strUserName: string = "";
  oSessionUser: IUsuario | null = null;

  constructor() { }

  ngOnInit() {
   
  }

}
