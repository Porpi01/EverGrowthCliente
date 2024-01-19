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
import { ConfirmationService} from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ValoracionService } from './service/Valoracion.service';
import { AdminProductoPlistUnroutedComponent } from './components/Producto/admin-producto-plist-unrouted/admin-producto-plist-unrouted.component';
import { AdminProductoPlistRoutedComponent } from './components/Producto/admin-producto-plist-routed/admin-producto-plist-routed.component';
import { ProductoService } from './service/Producto.service';
import { PedidoService } from './service/Pedido.service';
import { DetallePedidoService } from './service/DetallePedido.service';
import { CategoriaService } from './service/Categoria.service';
import { CarritoService } from './service/Carrito.service';
import { AdminPedidoPlistUnroutedComponent } from './components/Pedido/admin-pedido-plist-unrouted/admin-pedido-plist-unrouted.component';
import { AdminValoracionPlistUnroutedComponent } from './components/Valoracion/admin-valoracion-plist-unrouted/admin-valoracion-plist-unrouted.component';
import { AdminValoracionPlistRoutedComponent } from './components/Valoracion/admin-valoracion-plist-routed/admin-valoracion-plist-routed.component';
import { AdminPedidoPlistRoutedComponent } from './components/Pedido/admin-pedido-plist-routed/admin-pedido-plist-routed.component';
import { AdminDetallePedidoPlistUnroutedComponent } from './components/DetallePedido/admin-detallePedido-plist-unrouted/admin-detallePedido-plist-unrouted.component';
import { AdminDetallePedidoPlistRoutedComponent } from './components/DetallePedido/admin-detallePedido-plist-routed/admin-detallePedido-plist-routed.component';
import { AdminCategoriaPlistUnroutedComponent } from './components/Categoria/admin-categoria-plist-unrouted/admin-categoria-plist-unrouted.component';
import { AdminCategoriaPlistRoutedComponent } from './components/Categoria/admin-categoria-plist-routed/admin-categoria-plist-routed.component';
import { AdminCarritoPlistUnroutedComponent } from './components/Carrito/admin-carrito-plist-unrouted/admin-carrito-plist-unrouted.component';
import { AdminCarritoPlistRoutedComponent } from './components/Carrito/admin-carrito-plist-routed/admin-carrito-plist-routed.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,

    //Componentes entidad Usuario
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,

    //Componentes entidad Valoracion
    AdminValoracionPlistUnroutedComponent,
    AdminValoracionPlistRoutedComponent,

    //Componentes entidad Producto
    AdminProductoPlistUnroutedComponent,
    AdminProductoPlistRoutedComponent,

    //Componentes entidad Pedido
    AdminPedidoPlistUnroutedComponent,
    AdminPedidoPlistRoutedComponent,

    //Componentes entidad DetallePedido
    AdminDetallePedidoPlistUnroutedComponent,
    AdminDetallePedidoPlistRoutedComponent,

    //Componentes entidad Categoria
    AdminCategoriaPlistUnroutedComponent,
    AdminCategoriaPlistRoutedComponent,

    //Componentes entidad Carrito
    AdminCarritoPlistUnroutedComponent,
    AdminCarritoPlistRoutedComponent

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
    ToolbarModule,
    SplitButtonModule,
    InputTextModule,
    MatSnackBarModule,
    ConfirmPopupModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule
  
  ],
  providers: [
    UsuarioService,    
    ConfirmationService,
    ValoracionService,
    ProductoService,
    PedidoService,
    DetallePedidoService,
    CategoriaService,
    CarritoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
