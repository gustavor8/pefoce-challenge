import { Routes } from '@angular/router';

export const PERICIA_ROUTES: Routes = [
  {
    path: 'solicitacoes',
    loadComponent: () =>
      import('./solicitacoes-page/solicitacoes-search.component').then(
        (s) => s.SolicitacoesSearchComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (d) => d.DashboardComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
];
