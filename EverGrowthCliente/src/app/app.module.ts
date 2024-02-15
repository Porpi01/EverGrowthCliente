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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService  } from 'primeng/api';
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
import { DialogService} from 'primeng/dynamicdialog';
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
import { AdminUserSelectionUnroutedComponent } from './components/Usuario/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { MediaService } from './service/Media.service';
import { AdminProductoNewRoutedComponent } from './components/Producto/admin-producto-new-routed/admin-producto-new-routed.component';
import { AdminProductoFormUnroutedComponent } from './components/Producto/admin-producto-form-unrouted/admin-producto-form-unrouted.component';
import { AdminCategoriaSelectionUnroutedComponent } from './components/Categoria/admin-categoria-selection-unrouted/admin-categoria-selection-unrouted.component';
import { AdminProductoSelectionUnroutedComponent } from './components/Producto/admin-producto-selection-unrouted/admin-producto-selection-unrouted.component';
import { AdminValoracionNewRoutedComponent } from './components/Valoracion/admin-valoracion-new-routed/admin-valoracion-new-routed.component';
import { AdminValoracionFormUnroutedComponent } from './components/Valoracion/admin-valoracion-form-unrouted/admin-valoracion-form-unrouted.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { AdminValoracionEditRoutedComponent } from './components/Valoracion/admin-valoracion-edit-routed/admin-valoracion-edit-routed.component';
import { AdminPedidoEditRoutedComponent } from './components/Pedido/admin-pedido-edit-routed/admin-pedido-edit-routed.component';
import { AdminPedidoSelectionUnroutedComponent } from './components/Pedido/admin-pedido-selection-unrouted/admin-pedido-selection-unrouted.component';
import { AdminPedidoFormUnroutedComponent } from './components/Pedido/admin-pedido-form-unrouted/admin-pedido-form-unrouted.component';
import { AdminPedidoNewRoutedComponent } from './components/Pedido/admin-pedido-new-routed/admin-pedido-new-routed.component';
import { AdminDetallePedidoEditRoutedComponent } from './components/DetallePedido/admin-detallePedido-edit-routed/admin-detallePedido-edit-routed.component';
import { AdminDetallePedidoNewRoutedComponent } from './components/DetallePedido/admin-detallePedido-new-routed/admin-detallePedido-new-routed.component';
import { AdminDetallePedidoFormUnroutedComponent } from './components/DetallePedido/admin-detallePedido-form-unrouted/admin-detallePedido-form-unrouted.component';
import { AdminCategoriaNewRoutedComponent } from './components/Categoria/admin-categoria-new-routed/admin-categoria-new-routed.component';
import { AdminCategoriaFormUnroutedComponent } from './components/Categoria/admin-categoria-form-unrouted/admin-categoria-form-unrouted.component';
import { AdminCategoriaEditRoutedComponent } from './components/Categoria/admin-categoria-edit-routed/admin-categoria-edit-routed.component';
import { AdminCarritoNewRoutedComponent } from './components/Carrito/admin-carrito-new-routed/admin-carrito-new-routed.component';
import { AdminCarritoFormUnroutedComponent } from './components/Carrito/admin-carrito-form-unrouted/admin-carrito-form-unrouted.component';
import { AdminCarritoEditRoutedComponent } from './components/Carrito/admin-carrito-edit-routed/admin-carrito-edit-routed.component';
import { TrimPipe } from './pipes/trimString.pipe';
import { AdminProductoEditRoutedComponent } from './components/Producto/admin-producto-edit-routed/admin-producto-edit-routed.component';
import { PrecioPipe } from './pipes/Precio.pipe';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SesionService } from './service/Sesion.service';
import { CryptoService } from './service/Crypto.service';
import { LoginComponent } from './components/Shared/Login/Login.component';
import { LogoutComponent } from './components/Shared/Logout/Logout.component';
import { HomeComponent } from './components/Shared/Home/Home.component';
import { UserUserDetailUnroutedComponent } from './components/Usuario/user-user-detail-unrouted/user-user-detail-unrouted.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { CarouselModule } from 'primeng/carousel';
import { UserProductoDetailUnroutedComponent } from './components/Producto/user-producto-detail-unrouted/user-producto-detail-unrouted.component';
import { UserProductoViewRoutedComponent } from './components/Producto/user-producto-view-routed/user-producto-view-routed.component';
import { UserValoracionPlistUnroutedComponent } from './components/Valoracion/user-valoracion-plist-unrouted/user-valoracion-plist-unrouted.component';
import { UserCarritoDetailUnorutedComponent } from './components/Carrito/user-carrito-detail-unoruted/user-carrito-detail-unoruted.component';
import { UserProductoPlistUnroutedComponent } from './components/Producto/user-producto-plist-unrouted/user-producto-plist-unrouted.component';
import { UserProductoValoracionUnroutedComponent } from './components/Producto/user-producto-valoracion-unrouted/user-producto-valoracion-unrouted.component';
import { UserCarritoPlistUnroutedComponent } from './components/Carrito/user-carrito-plist-unrouted/user-carrito-plist-unrouted.component';
import { UserCarritoPlistRoutedComponent } from './components/Carrito/user-carrito-plist-routed/user-carrito-plist-routed.component';
import { UserPedidoDetailUnroutedComponent } from './components/Pedido/user-pedido-detail-unrouted/user-pedido-detail-unrouted.component';
import { UserPedidoViewRoutedComponent } from './components/Pedido/user-pedido-view-routed/user-pedido-view-routed.component';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    PrecioPipe,
    TrimPipe,
    LogoutComponent,
    LoginComponent,
    HomeComponent,
 
 

    //Componentes entidad Usuario
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,
    AdminUserFormUnroutedComponent,
    AdminUserNewRoutedComponent,
    AdminUserViewRoutedComponent,
    AdminUserDetailUnroutedComponent,
    AdminUserEditRoutedComponent,
    AdminUserSelectionUnroutedComponent,
    UserUserDetailUnroutedComponent,
    

    //Componentes entidad Valoracion
    AdminValoracionPlistUnroutedComponent,
    AdminValoracionPlistRoutedComponent,
    AdminValoracionDetailUnroutedComponent,
    AdminValoracionViewRoutedComponent,
    AdminValoracionNewRoutedComponent,
    AdminValoracionFormUnroutedComponent,
    AdminValoracionEditRoutedComponent,
    UserValoracionPlistUnroutedComponent,

    //Componentes entidad Producto
    AdminProductoPlistUnroutedComponent,
    AdminProductoPlistRoutedComponent,
    AdminProductoViewRoutedComponent,
    AdminProductoDetailUnroutedComponent,
    AdminProductoNewRoutedComponent,
    AdminProductoFormUnroutedComponent,
    AdminProductoSelectionUnroutedComponent,
    AdminProductoEditRoutedComponent,
    UserProductoDetailUnroutedComponent,
    UserProductoViewRoutedComponent,
    UserProductoPlistUnroutedComponent,
    UserProductoValoracionUnroutedComponent,

    //Componentes entidad Pedido
    AdminPedidoPlistUnroutedComponent,
    AdminPedidoPlistRoutedComponent,
    AdminPedidoViewRoutedComponent,
    AdminPedidoDetailUnroutedComponent,
    AdminPedidoEditRoutedComponent,
    AdminPedidoSelectionUnroutedComponent,
    AdminPedidoFormUnroutedComponent,
    AdminPedidoNewRoutedComponent,
    UserPedidoDetailUnroutedComponent,
    UserPedidoViewRoutedComponent,

    //Componentes entidad DetallePedido
    AdminDetallePedidoPlistUnroutedComponent,
    AdminDetallePedidoPlistRoutedComponent,
    AdminDetallePedidoViewRoutedComponent,
    AdminDetallePedidoDetailUnroutedComponent,
    AdminDetallePedidoEditRoutedComponent,
    AdminDetallePedidoNewRoutedComponent,
    AdminDetallePedidoFormUnroutedComponent,
    

    //Componentes entidad Categoria
    AdminCategoriaPlistUnroutedComponent,
    AdminCategoriaPlistRoutedComponent,
    AdminCategoriaViewRoutedComponent,
    AdminCategoriaDetailUnroutedComponent,
    AdminCategoriaSelectionUnroutedComponent,
    AdminCategoriaNewRoutedComponent,
    AdminCategoriaFormUnroutedComponent,
    AdminCategoriaEditRoutedComponent,

    //Componentes entidad Carrito
    AdminCarritoPlistUnroutedComponent,
    AdminCarritoPlistRoutedComponent,
    AdminCarritoViewRoutedComponent,
    AdminCarritoDetailUnroutedComponent,
    AdminCarritoNewRoutedComponent ,
    AdminCarritoFormUnroutedComponent,
    AdminCarritoEditRoutedComponent,
    UserCarritoDetailUnorutedComponent,
    UserCarritoPlistUnroutedComponent,
    UserCarritoPlistRoutedComponent


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
    CarouselModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CardModule,
    DataViewModule,
    OrderListModule,
    PickListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PanelModule,
    FileUploadModule,
    DialogModule
  
   




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

    DialogService,
    MediaService,
    SesionService,
    CryptoService,
    
   {provide:MAT_NATIVE_DATE_FORMATS, useValue: 'es-ES'},
   {provide:MAT_DATE_LOCALE, useValue: 'es-ES'},
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
