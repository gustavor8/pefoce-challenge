import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { MenuItem, MenuState } from '../../shared/components/menu/menu.types';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MenuService } from '../../core/services/menu/menu.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-baselayout',
  imports: [RouterOutlet, MenuComponent, HeaderComponent, NgClass],
  templateUrl: './baselayout.component.html',
  styleUrl: './baselayout.component.scss',
})
export class BaselayoutComponent {
  private menuService = inject(MenuService);

  public readonly isMenuExpanded = this.menuService.isMenuExpanded;
  public readonly isSmallScreen = this.menuService.isSmallScreen;

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

  public menuItems: MenuItem[] = [
    { label: 'Home', icon: 'house', route: '/home' },
    {
      label: 'Módulo Perito',
      icon: 'search',
      children: [
        {
          label: 'Solicitações',
          route: '/solicitacoes',
          icon: 'task',
        },
        {
          label: 'Dashboard',
          route: '/dashboards',
          icon: 'fileEarMarkBarGraph',
        },
      ],
    },
  ];
}
