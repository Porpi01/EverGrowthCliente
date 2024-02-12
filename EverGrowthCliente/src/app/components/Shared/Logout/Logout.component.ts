import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/service/Sesion.service';

@Component({
  selector: 'app-Logout',
  templateUrl: './Logout.component.html',
  styleUrls: ['./Logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private SesionService: SesionService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.SesionService.logout();
    this.SesionService.emit({ type: 'logout' });
    this.oMatSnackBar.open("Sesión cerrada.", '', { duration: 2000 });
    this.oRouter.navigate(['/home']);
  }


  cancel() {
    this.oRouter.navigate(['/home']);

     
    }




}