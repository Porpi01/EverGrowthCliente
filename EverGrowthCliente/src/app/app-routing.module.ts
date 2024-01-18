import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserPlistRoutedComponent } from './components/Usuario/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminValoracionPlistRoutedComponent } from './components/Valoracion/admin-valoracion-plist-routed/admin-valoracion-plist-routed.component';

const routes: Routes = [

  {path: 'admin/usuario/plist', component: AdminUserPlistRoutedComponent},
  {path: 'admin/usuario/plist/byusuario/:id', component: AdminUserPlistRoutedComponent},

  {path: 'admin/valoracion/plist', component: AdminValoracionPlistRoutedComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
