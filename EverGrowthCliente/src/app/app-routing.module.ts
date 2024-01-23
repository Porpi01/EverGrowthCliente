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

const routes: Routes = [
//Usuario
  { path: 'admin/usuario/plist', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/plist/byvaloracion/:id', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/plist/bycarrito/:id', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/plist/bypedido/:id', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/new', component: AdminUserNewRoutedComponent },
  { path: 'admin/usuario/view/:id', component: AdminUserViewRoutedComponent },
  { path: 'admin/usuario/edit/:id', component: AdminUserEditRoutedComponent },

  
//Valoracion
  { path: 'admin/valoracion/plist', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/plist/byvaloracion/:id', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/view/:id', component: AdminValoracionViewRoutedComponent },




//Producto
  { path: 'admin/producto/plist', component: AdminProductoPlistRoutedComponent },
  { path: 'admin/producto/plist/byproducto/:id', component: AdminProductoPlistRoutedComponent },
  {path: 'admin/producto/plist/byvaloracion/:id', component: AdminProductoPlistRoutedComponent },
  { path: 'admin/producto/view/:id', component: AdminProductoViewRoutedComponent },



//Pedido
{ path: 'admin/pedido/plist', component: AdminPedidoPlistRoutedComponent },
{ path: 'admin/pedido/plist/bypedido/:id', component: AdminPedidoPlistRoutedComponent },
//DetallePedido
{ path: 'admin/detallePedido/plist', component: AdminDetallePedidoPlistRoutedComponent },
{ path: 'admin/detallePedido/plist/bydetallePedido/:id', component: AdminDetallePedidoPlistRoutedComponent },
//Categoria
{ path: 'admin/categoria/plist', component: AdminCategoriaPlistRoutedComponent },
{ path: 'admin/categoria/plist/bycategoria/:id', component: AdminCategoriaPlistRoutedComponent },
//Carrito
{ path: 'admin/carrito/plist', component: AdminCarritoPlistRoutedComponent },
{ path: 'admin/carrito/plist/bycarrito/:id', component: AdminCarritoPlistRoutedComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
