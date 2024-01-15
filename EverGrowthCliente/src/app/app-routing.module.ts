import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserPlistUnroutedComponent } from './components/Usuario/admin-user-plist-unrouted/admin-user-plist-unrouted.component';

const routes: Routes = [

  {path: 'admin/usuario/plist', component: AdminUserPlistUnroutedComponent},
  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
