import { Routes } from '@angular/router';  

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'dashboard-nph',
        title: 'Dashboard',
        loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component'),
      },
      {
        path: 'control',
        title: 'Casa',
        loadComponent: () => import('./dashboard/pages/casa/casa.component').then(m => m.CasaComponent),
      },
      {
        path: 'consumo interno',
        title: 'Consumo',
        loadComponent: () => import('./dashboard/pages/consumo-interno/consumo-interno.component').then(m => m.ConsumoInternoComponent),
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadComponent: () => import('./dashboard/pages/reportes/reportes.component').then(m => m.ReportesComponent),
      },
      {
        path: 'Galpon',
        title: 'Galpon',
        loadComponent: () => import('./dashboard/pages/personas/personas.component').then(m => m.PersonasComponent),
      },
      {
        path: 'Ciclo de Vida',
        title: 'Ciclo de Vidaa',
        loadComponent: () => import('./dashboard/pages/familia/familia.component').then(m => m.FamiliaComponent),
      },
      {
        path: '', 
        redirectTo: 'dashboard-nph', 
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
