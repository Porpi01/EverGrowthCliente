import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUsuario, SessionEvent } from 'src/app/model/model.interfaces';
import { SesionService } from 'src/app/service/Sesion.service';
import { UsuarioService } from 'src/app/service/Usuario.service';
import { UserUserDetailUnroutedComponent } from '../../Usuario/user-user-detail-unrouted/user-user-detail-unrouted.component';


@Component({
  selector: 'app-Menu',
  templateUrl: './Menu.component.html',
  styleUrls: ['./Menu.component.css'],
 
})
export class MenuComponent implements OnInit {


  strUserName: string = "";
  oSessionUser: IUsuario | null = null;
  strUrl: string = "";

  constructor(
    private SesionService: SesionService,
    public oDialogService: DialogService,
    private UsuarioService: UsuarioService,
    private oRouter: Router
  ) {
    
    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.strUrl = ev.url;
      }
    })
    
    this.strUserName = SesionService.getUsername();
    
    this.UsuarioService.getByUsername(this.SesionService.getUsername()).subscribe({
      next: (oUser: IUsuario) => {
        this.oSessionUser = oUser;
       
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  ngOnInit() {
    this.SesionService.on().subscribe({
      next: (data: SessionEvent) => {
        console.log(data);
        console.log(this.strUserName);
     
        if (data.type == 'login') {
          console.log(data);
          this.strUserName =  this.SesionService.getUsername();
          console.log(this.strUserName);
          this.UsuarioService.getByUsername(this.SesionService.getUsername()).subscribe({
           
            next: (oUser: IUsuario) => {
              this.oSessionUser = oUser;
            
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          });
        }
        if (data.type == 'logout') {
          this.strUserName = "";
        }
      }
    });
  }



}
