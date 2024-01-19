import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserPlistRoutedComponent } from './components/Usuario/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminValoracionPlistRoutedComponent } from './components/Valoracion/admin-valoracion-plist-routed/admin-valoracion-plist-routed.component';
import { AdminProductoPlistRoutedComponent } from './components/Producto/admin-producto-plist-routed/admin-producto-plist-routed.component';
import { AdminPedidoPlistRoutedComponent } from './components/Pedido/admin-pedido-plist-routed/admin-pedido-plist-routed.component';

const routes: Routes = [
//Usuario
  { path: 'admin/usuario/plist', component: AdminUserPlistRoutedComponent },
  { path: 'admin/usuario/plist/byusuario/:id', component: AdminUserPlistRoutedComponent },
//Valoracion
  { path: 'admin/valoracion/plist', component: AdminValoracionPlistRoutedComponent },
  { path: 'admin/valoracion/plist/byvaloracion/:id', component: AdminValoracionPlistRoutedComponent },
//Producto
  { path: 'admin/producto/plist', component: AdminProductoPlistRoutedComponent },
  { path: 'admin/producto/plist/byproducto/:id', component: AdminProductoPlistRoutedComponent },
//Pedido
{ path: 'admin/pedido/plist', component: AdminPedidoPlistRoutedComponent },
{ path: 'admin/pedido/plist/bypedido/:id', component: AdminPedidoPlistRoutedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
