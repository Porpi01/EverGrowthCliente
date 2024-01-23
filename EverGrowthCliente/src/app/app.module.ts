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
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FormBuilder, FormsModule } from '@angular/forms';
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
import { AdminUserFormUnroutedComponent } from './components/Usuario/admin-user-form-unrouted/admin-user-form-unrouted.component';
import { AdminUserNewRoutedComponent } from './components/Usuario/admin-user-new-routed/admin-user-new-routed.component';
import { MessagesModule } from 'primeng/messages';
import { FooterComponent } from './components/Shared/Footer/Footer.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { AdminUserViewRoutedComponent } from './components/Usuario/admin-user-view-routed/admin-user-view-routed.component';
import { CardModule } from 'primeng/card';
import { AdminUserDetailUnroutedComponent } from './components/Usuario/admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { AdminUserEditRoutedComponent } from './components/Usuario/admin-user-edit-routed/admin-user-edit-routed.component';
import { DataViewModule } from 'primeng/dataview';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminValoracionDetailUnroutedComponent } from './components/Valoracion/admin-valoracion-detail-unrouted/admin-valoracion-detail-unrouted.component';
import { AdminValoracionViewRoutedComponent } from './components/Valoracion/admin-valoracion-view-routed/admin-valoracion-view-routed.component';
import { AdminProductoViewRoutedComponent } from './components/Producto/admin-producto-view-routed/admin-producto-view-routed.component';
import { AdminProductoDetailUnroutedComponent } from './components/Producto/admin-producto-detail-unrouted/admin-producto-detail-unrouted.component';
import { AdminPedidoViewRoutedComponent } from './components/Pedido/admin-pedido-view-routed/admin-pedido-view-routed.component';
import { AdminPedidoDetailUnroutedComponent } from './components/Pedido/admin-pedido-detail-unrouted/admin-pedido-detail-unrouted.component';
import { AdminDetallePedidoViewRoutedComponent } from './components/DetallePedido/admin-detallePedido-view-routed/admin-detallePedido-view-routed.component';
import { AdminDetallePedidoDetailUnroutedComponent } from './components/DetallePedido/admin-detallePedido-detail-unrouted/admin-detallePedido-detail-unrouted.component';
import { AdminCategoriaViewRoutedComponent } from './components/Categoria/admin-categoria-view-routed/admin-categoria-view-routed.component';
import { AdminCategoriaDetailUnroutedComponent } from './components/Categoria/admin-categoria-detail-unrouted/admin-categoria-detail-unrouted.component';
import { AdminCarritoViewRoutedComponent } from './components/Carrito/admin-carrito-view-routed/admin-carrito-view-routed.component';
import { AdminCarritoDetailUnroutedComponent } from './components/Carrito/admin-carrito-detail-unrouted/admin-carrito-detail-unrouted.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,

    //Componentes entidad Usuario
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,
    AdminUserFormUnroutedComponent,
    AdminUserNewRoutedComponent,
    AdminUserViewRoutedComponent,
    AdminUserDetailUnroutedComponent,
    AdminUserEditRoutedComponent,
    

    //Componentes entidad Valoracion
    AdminValoracionPlistUnroutedComponent,
    AdminValoracionPlistRoutedComponent,
    AdminValoracionDetailUnroutedComponent,
    AdminValoracionViewRoutedComponent,

    //Componentes entidad Producto
    AdminProductoPlistUnroutedComponent,
    AdminProductoPlistRoutedComponent,
    AdminProductoViewRoutedComponent,
    AdminProductoDetailUnroutedComponent,

    //Componentes entidad Pedido
    AdminPedidoPlistUnroutedComponent,
    AdminPedidoPlistRoutedComponent,
    AdminPedidoViewRoutedComponent,
    AdminPedidoDetailUnroutedComponent,

    //Componentes entidad DetallePedido
    AdminDetallePedidoPlistUnroutedComponent,
    AdminDetallePedidoPlistRoutedComponent,
    AdminDetallePedidoViewRoutedComponent,
    AdminDetallePedidoDetailUnroutedComponent,

    //Componentes entidad Categoria
    AdminCategoriaPlistUnroutedComponent,
    AdminCategoriaPlistRoutedComponent,
    AdminCategoriaViewRoutedComponent,
    AdminCategoriaDetailUnroutedComponent,

    //Componentes entidad Carrito
    AdminCarritoPlistUnroutedComponent,
    AdminCarritoPlistRoutedComponent,
    AdminCarritoViewRoutedComponent,
    AdminCarritoDetailUnroutedComponent

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
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CardModule,
    DataViewModule,
   




  ],
  providers: [
    UsuarioService,
    ValoracionService,
    ProductoService,
    PedidoService,
    DetallePedidoService,
    CategoriaService,
    CarritoService,
    ConfirmationService,
    MessageService,
    FormBuilder,
    DialogService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
