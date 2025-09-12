import { Routes } from '@angular/router';
import { authGuard } from './core/guards/authGuard/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/login-page/login.routes').then((l) => l.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
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
          import('./features/home/home.component').then((h) => h.HomeComponent),
      },
      {
        path: 'perito',
        loadChildren: () =>
          import('./features/pericia/pericia.routes').then(
            (p) => p.PERICIA_ROUTES
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/erro-page/erro-page.component').then(
        (notRoute) => notRoute.ErroPageComponent
      ),
  },
];
