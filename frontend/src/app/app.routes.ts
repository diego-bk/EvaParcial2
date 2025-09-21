import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { ConferenciasComponent } from './components/conferencias/conferencias';
import { AsistentesComponent } from './components/asistentes/asistentes';
import { RegistrosAsistenciaComponent } from './components/registros-asistencia/registros-asistencia';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'conferencias', component: ConferenciasComponent },
      { path: 'asistentes', component: AsistentesComponent },
      { path: 'registros-asistencia', component: RegistrosAsistenciaComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
