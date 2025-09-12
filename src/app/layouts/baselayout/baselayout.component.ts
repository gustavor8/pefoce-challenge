import { Component, computed, Inject, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { MenuItem, MenuState } from '../../shared/components/menu/menu.types';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MenuService } from '../../core/services/menu/menu.service';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-baselayout',
  imports: [
    RouterOutlet,
    MenuComponent,
    HeaderComponent,
    NgClass,
    ButtonComponent,
  ],
  templateUrl: './baselayout.component.html',
  styleUrl: './baselayout.component.scss',
})
export class BaselayoutComponent implements OnDestroy {
  private menuService = inject(MenuService);
  private destroy$ = new Subject<void>();
  private isLoggedIn: boolean = false;
  private authService = inject(AuthService);
  public readonly isMenuExpanded = this.menuService.isMenuExpanded;
  public readonly isSmallScreen = this.menuService.isSmallScreen;
  private router = inject(Router);
  constructor() {
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: boolean) => (this.isLoggedIn = status));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public mainContentClass = computed(() => {
    if (this.isSmallScreen()) return '';
    switch (this.menuService.menuState()) {
      case MenuState.Expanded:
        return 'menu-expanded';
      case MenuState.Collapsed:
        return 'menu-collapsed';
      default:
        return '';
    }
  });

  public onHeaderMenuClick(): void {
    this.menuService.toggleMenuState();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  public menuItems: MenuItem[] = [
    { label: 'Home', icon: 'house', route: '/home' },
    {
      label: 'Módulo Perito',
      icon: 'search',
      children: [
        {
          label: 'Solicitações',
          route: '/perito/solicitacoes',
          icon: 'task',
        },
        {
          label: 'Dashboard',
          route: '/perito/dashboard',
          icon: 'fileEarMarkBarGraph',
        },
      ],
    },
  ];
}
