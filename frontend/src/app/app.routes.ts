import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UsuariosComponent } from './components/usuarios/usuarios';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
