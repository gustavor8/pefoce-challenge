import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/pages/login-page/login.component').then(
        (l) => l.LoginComponent
      ),
  },
  {
    path: '',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/baselayout/baselayout.component').then(
        (c) => c.BaselayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/pages/home/home.component').then(
            (h) => h.HomeComponent
          ),
      },
      //     {
      //       path: 'dashboard',
      //       loadComponent: () =>
      //         import('./features/pages/dashboard/dashboard.component').then(
      //           (d) => d.DashboardComponent
      //         ),
      //     },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/pages/erro-page/erro-page.component').then(
        (notRoute) => notRoute.ErroPageComponent
      ),
  },
];
