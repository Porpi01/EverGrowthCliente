import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminUserPlistRoutedComponent } from './components/Usuario/admin-user-plist-routed/admin-user-plist-routed.component';
import { MenuComponent } from './components/Shared/Menu/Menu.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { AdminUserPlistUnroutedComponent } from './components/Usuario/admin-user-plist-unrouted/admin-user-plist-unrouted.component';



@NgModule({
  declarations: [		
    AppComponent,
    MenuComponent,


   

    //Componentes entidad Usuario
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent
 
  
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [

    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
