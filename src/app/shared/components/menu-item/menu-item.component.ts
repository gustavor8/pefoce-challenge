import { Component, computed, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { MenuItem, MenuState } from '../menu/menu.types';
import { MenuService } from '../../../core/services/menu/menu.service';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [RouterModule, IconComponent, NgTemplateOutlet],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  @Input({ required: true }) item!: MenuItem;

  public menuService = inject(MenuService);

  @Input({ required: true }) depth!: number;
  public isMenuExpanded = this.menuService.isMenuExpanded;

  public shouldShowExpandedContent = computed(() => {
    const state = this.menuService.menuState();
    const isHovering = this.menuService.isHovering();
    return (
      state === MenuState.Expanded ||
      (state === MenuState.Collapsed && isHovering)
    );
  });

  public shouldShowBorder = computed(() => {
    return (
      this.isSubmenuOpen() &&
      this.depth + 1 === this.menuService.maxActiveDepth()
    );
  });

  public isSubmenuOpen = computed(() =>
    this.menuService.activeSubMenus().has(this.item.id!)
  );

  public hasChildren = computed(
    () => !!this.item.children && this.item.children.length > 0
  );

  handleAction(event: MouseEvent) {
    if (this.item.action) {
      event.preventDefault();
      this.item.action();
      return;
    }

    if (this.hasChildren() && this.shouldShowExpandedContent()) {
      event.preventDefault();
      this.menuService.toggleSubmenu(this.item.id!);
    }
  }
}
