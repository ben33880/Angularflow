import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: NotFoundComponent
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
        loadComponent: () => import('./features/devices/devices.component').then(m => m.DevicesComponent)
      },
      {
        path: 'inputs',
        loadComponent: () => import('./features/devices/devices.component').then(m => m.DevicesComponent)
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  }
];
