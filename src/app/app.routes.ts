import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./layout/login/login.component').then((l) => l.LoginComponent),
  //   canActivate: [loginGuard],
  // },
  {
    path: '',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/baselayout/baselayout.component').then(
        (c) => c.BaselayoutComponent
      ),
    children: [
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
    data: {
      errorCode: '404',
      errorTitle: 'Página não encontrada',
      errorMessage:
        'Ops... Página não localizada. Parece que vocês buscou algo que não existe no sistema, caso necessário entre em contato!',
      buttonText: 'Voltar ao início',
    },
  },
];
