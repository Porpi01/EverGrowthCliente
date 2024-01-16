import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminUserPlistRoutedComponent } from './components/Usuario/admin-user-plist-routed/admin-user-plist-routed.component';
import { MenuComponent } from './components/Shared/Menu/Menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminUserPlistUnroutedComponent } from './components/Usuario/admin-user-plist-unrouted/admin-user-plist-unrouted.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from './service/Usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';




@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,

    //Componentes entidad Usuario
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    HttpClientModule,
    PaginatorModule,
    DividerModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
   
  ],
  providers: [
    UsuarioService,    
    ConfirmationService,
    MessageService,
   

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
