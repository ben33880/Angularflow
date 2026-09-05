import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MqttSetupComponent } from './features/mqtt-setup/mqtt-setup.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'setup',
    component: MqttSetupComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'system',
        loadComponent: () => import('./features/system/system.component').then(m => m.SystemComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./features/logs/logs.component').then(m => m.LogsComponent)
      },
      {
        path: 'alarms',
        loadComponent: () => import('./features/alarms/alarms.component').then(m => m.AlarmsComponent)
      },
      {
        path: 'config',
        loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent)
      },
      {
        path: 'relays',
        loadComponent: () => import('./features/relays/relays.component').then(m => m.RelaysComponent)
      },
      {
        path: 'inputs',
        loadComponent: () => import('./features/inputs/inputs.component').then(m => m.InputsComponent)
      }
    ]
  }
];
