import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { SesionService } from './../../../service/Sesion.service';
import { UsuarioService } from './../../../service/Usuario.service';
import { IUsuario } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {


  username: string = '';
  userSession: IUsuario | null = null;
  url: string = '';


  constructor(
    private Router: Router,
    private SesionService: SesionService,
    private UsuarioService: UsuarioService,
  ) {
    console.log('MenuUnroutedComponent creado'); 

    this.Router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.url = ev.url;
      }
    })

    this.username = SesionService.getUsername();
    this.UsuarioService.getByUsername(this.SesionService.getUsername()).subscribe({
      next: (user: IUsuario) => {
        this.userSession = user;
        console.log('User Session:', this.userSession); // Agrega este log
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
   }

  ngOnInit() {
  }



}