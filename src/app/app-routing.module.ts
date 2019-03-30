import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
