import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserPlistRoutedComponent } from './components/Usuario/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminValoracionPlistRoutedComponent } from './components/Valoracion/admin-valoracion-plist-routed/admin-valoracion-plist-routed.component';
import { AdminProductoPlistRoutedComponent } from './components/Producto/admin-producto-plist-routed/admin-producto-plist-routed.component';
import { AdminPedidoPlistRoutedComponent } from './components/Pedido/admin-pedido-plist-routed/admin-pedido-plist-routed.component';
import { AdminDetallePedidoPlistRoutedComponent } from './components/DetallePedido/admin-detallePedido-plist-routed/admin-detallePedido-plist-routed.component';
import { AdminCategoriaPlistRoutedComponent } from './components/Categoria/admin-categoria-plist-routed/admin-categoria-plist-routed.component';
import { AdminCarritoPlistRoutedComponent } from './components/Carrito/admin-carrito-plist-routed/admin-carrito-plist-routed.component';
import { AdminUserNewRoutedComponent } from './components/Usuario/admin-user-new-routed/admin-user-new-routed.component';
import { AdminUserViewRoutedComponent } from './components/Usuario/admin-user-view-routed/admin-user-view-routed.component';
import { AdminUserEditRoutedComponent } from './components/Usuario/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminValoracionViewRoutedComponent } from './components/Valoracion/admin-valoracion-view-routed/admin-valoracion-view-routed.component';
import { AdminProductoViewRoutedComponent } from './components/Producto/admin-producto-view-routed/admin-producto-view-routed.component';
import { AdminPedidoViewRoutedComponent } from './components/Pedido/admin-pedido-view-routed/admin-pedido-view-routed.component';
import { AdminDetallePedidoViewRoutedComponent } from './components/DetallePedido/admin-detallePedido-view-routed/admin-detallePedido-view-routed.component';
import { AdminCategoriaViewRoutedComponent } from './components/Categoria/admin-categoria-view-routed/admin-categoria-view-routed.component';
import { AdminCarritoViewRoutedComponent } from './components/Carrito/admin-carrito-view-routed/admin-carrito-view-routed.component';
import { AdminProductoNewRoutedComponent } from './components/Producto/admin-producto-new-routed/admin-producto-new-routed.component';
import { AdminValoracionNewRoutedComponent } from './components/Valoracion/admin-valoracion-new-routed/admin-valoracion-new-routed.component';
import { AdminValoracionEditRoutedComponent } from './components/Valoracion/admin-valoracion-edit-routed/admin-valoracion-edit-routed.component';
import { AdminPedidoEditRoutedComponent } from './components/Pedido/admin-pedido-edit-routed/admin-pedido-edit-routed.component';
import { AdminPedidoNewRoutedComponent } from './components/Pedido/admin-pedido-new-routed/admin-pedido-new-routed.component';
import { AdminDetallePedidoEditRoutedComponent } from './components/DetallePedido/admin-detallePedido-edit-routed/admin-detallePedido-edit-routed.component';
import { AdminCategoriaNewRoutedComponent } from './components/Categoria/admin-categoria-new-routed/admin-categoria-new-routed.component';
import { AdminCategoriaEditRoutedComponent } from './components/Categoria/admin-categoria-edit-routed/admin-categoria-edit-routed.component';
import { AdminCarritoNewRoutedComponent } from './components/Carrito/admin-carrito-new-routed/admin-carrito-new-routed.component';
import { AdminCarritoEditRoutedComponent } from './components/Carrito/admin-carrito-edit-routed/admin-carrito-edit-routed.component';
import { AdminDetallePedidoNewRoutedComponent } from './components/DetallePedido/admin-detallePedido-new-routed/admin-detallePedido-new-routed.component';
import { AdminProductoEditRoutedComponent } from './components/Producto/admin-producto-edit-routed/admin-producto-edit-routed.component';
import { LoginComponent } from './components/Shared/Login/Login.component';
import { LogoutComponent } from './components/Shared/Logout/Logout.component';
import { HomeComponent } from './components/Shared/Home/Home.component';
import { HomeUserComponent } from './components/Shared/HomeUser/HomeUser.component';
import { UserProductoViewRoutedComponent } from './components/Producto/user-producto-view-routed/user-producto-view-routed.component';
import { HomeLogoutComponent } from './components/Shared/HomeLogout/HomeLogout.component';
import { UserCarritoViewRoutedComponent } from './components/Carrito/user-carrito-view-routed/user-carrito-view-routed.component';
import { UserValoracionNewRoutedComponent } from './components/Valoracion/user-valoracion-new-routed/user-valoracion-new-routed.component';

const routes: Routes = [

  { path: '', component: HomeLogoutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'userhome', component: HomeUserComponent },
  { path: 'homelogout', component: HomeLogoutComponent },

  
  

//Usuario
  { path: 'admin/usuario/plist', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/new', component: AdminUserNewRoutedComponent },
  { path: 'admin/usuario/view/:id', component: AdminUserViewRoutedComponent },
  { path: 'admin/usuario/plist/bypedido/:idpedido', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/edit/:id', component: AdminUserEditRoutedComponent },
  
  
//Valoracion
  { path: 'admin/valoracion/plist', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/plist/byusuario/:idusuario', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/plist/byproducto/:idproducto', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/view/:id', component: AdminValoracionViewRoutedComponent },
  { path: 'admin/valoracion/new', component: AdminValoracionNewRoutedComponent },
  { path: 'admin/valoracion/edit/:id', component: AdminValoracionEditRoutedComponent },
  { path: 'usuario/valoracion/new', component: UserValoracionNewRoutedComponent },

  



//Producto
  { path: 'admin/producto/plist', component: AdminProductoPlistRoutedComponent },
  { path: 'admin/producto/plist/bycategoria/:idcategoria', component: AdminProductoPlistRoutedComponent },
  { path: 'admin/producto/view/:id', component: AdminProductoViewRoutedComponent },
  { path: 'admin/producto/new', component: AdminProductoNewRoutedComponent },
  { path: 'admin/producto/edit/:id', component: AdminProductoEditRoutedComponent },
  { path: 'user/producto/view/:id', component: UserProductoViewRoutedComponent },

  

//Pedido
{ path: 'admin/pedido/plist', component: AdminPedidoPlistRoutedComponent },
{ path: 'admin/pedido/plist/byusuario/:idusuario', component: AdminPedidoPlistRoutedComponent },
{ path: 'admin/pedido/view/:id', component: AdminPedidoViewRoutedComponent },
{ path: 'admin/pedido/new', component: AdminPedidoNewRoutedComponent},
{ path: 'admin/pedido/edit/:id', component: AdminPedidoEditRoutedComponent},



//DetallePedido
{ path: 'admin/detallePedido/plist', component: AdminDetallePedidoPlistRoutedComponent },
{ path: 'admin/detallePedido/plist/bypedido/:idpedido', component: AdminDetallePedidoPlistRoutedComponent },
{ path: 'admin/detallePedido/plist/byproducto/:idproducto', component: AdminDetallePedidoPlistRoutedComponent },
{ path: 'admin/detallePedido/view/:id', component: AdminDetallePedidoViewRoutedComponent },
{ path: 'admin/detallePedido/new', component: AdminDetallePedidoNewRoutedComponent},
{ path: 'admin/detallePedido/edit/:id', component: AdminDetallePedidoEditRoutedComponent},




//Categoria
{ path: 'admin/categoria/plist', component: AdminCategoriaPlistRoutedComponent },
{ path: 'admin/categoria/view/:id', component: AdminCategoriaViewRoutedComponent },
{ path: 'admin/categoria/new', component: AdminCategoriaNewRoutedComponent},
{ path: 'admin/categoria/edit/:id', component: AdminCategoriaEditRoutedComponent},


//Carrito
{ path: 'admin/carrito/plist', component: AdminCarritoPlistRoutedComponent },
{ path: 'admin/carrito/plist/byusuario/:idusuario', component: AdminCarritoPlistRoutedComponent },
{ path: 'admin/carrito/plist/byproducto/:idproducto', component: AdminCarritoPlistRoutedComponent },
{ path: 'admin/carrito/view/:id', component: AdminCarritoViewRoutedComponent },
{ path: 'admin/carrito/new', component: AdminCarritoNewRoutedComponent},
{ path: 'admin/carrito/edit/:id', component: AdminCarritoEditRoutedComponent},
{ path: 'usuario/carrito/view/:id', component: UserCarritoViewRoutedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
