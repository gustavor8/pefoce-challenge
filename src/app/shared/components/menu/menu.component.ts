import {
  Component,
  effect,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { ActionItem, MenuItem, MenuState } from './menu.types';
import { MenuService } from '../../../core/services/menu/menu.service';
import { IconComponent } from '../icon/icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent, IconComponent, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  public menuService = inject(MenuService);
  private renderer = inject(Renderer2);
  private backdropElement: HTMLDivElement | null = null;

  constructor() {
    effect(() => {
      const isMobile = this.menuService.isSmallScreen();
      const state = this.menuService.menuState();

      if (isMobile && state === MenuState.Expanded) {
        this.createBackdrop();
      } else {
        this.destroyBackdrop();
      }
    });
  }

  private createBackdrop(): void {
    if (this.backdropElement) {
      return;
    }

    this.backdropElement = this.renderer.createElement('div');
    this.renderer.addClass(this.backdropElement, 'menu-backdrop-external');

    this.renderer.listen(this.backdropElement, 'click', () => {
      this.menuService.closeMenuOnMobile();
    });

    this.renderer.appendChild(document.body, this.backdropElement);
  }

  private destroyBackdrop(): void {
    if (this.backdropElement) {
      this.renderer.removeChild(document.body, this.backdropElement);
      this.backdropElement = null;
    }
  }

  @Input({ required: true })
  set menuItems(items: MenuItem[]) {
    this.menuService.setMenuItems(items);
  }

  @Input() actionItems: ActionItem[] = [];
  @Input() logoSize: number = 45;
  @Input() animatedLogo: boolean = true;

  @Input() logoSrc?: string;
  @Input() logoText?: string;

  ngOnInit(): void {
    this.menuService.isMenuRendered.set(true);
  }

  ngOnDestroy(): void {
    this.menuService.isMenuRendered.set(false);
    this.destroyBackdrop();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.isCollapsed) {
      this.menuService.isHovering.set(true);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.menuService.isHovering.set(false);
  }

  @HostBinding('class.expanded')
  get isExpanded() {
    return this.menuService.menuState() === MenuState.Expanded;
  }
  @HostBinding('class.collapsed')
  get isCollapsed() {
    return this.menuService.menuState() === MenuState.Collapsed;
  }
  @HostBinding('class.hidden')
  get isHidden() {
    return this.menuService.menuState() === MenuState.Hidden;
  }

  @HostBinding('class.hover-expanded')
  get isHoverExpanded() {
    return this.isCollapsed && this.menuService.isHovering();
  }
}
