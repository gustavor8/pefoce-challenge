import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../core/services/menu.service';
import { MenuState } from '../menu/menu.types';

export type HeaderBehavior = 'static' | 'fixed' | 'auto-hide';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuButtonClick = new EventEmitter<void>();
  @Input() showMenuButton = true;

  @Input() behavior: HeaderBehavior = 'fixed';
  @Input() isMenuOpen = false;

  private menuService = inject(MenuService);
  public readonly isMobile = this.menuService.isSmallScreen;

  private lastScrollY = 0;
  protected isHidden = false;

  public headerStyles = computed(() => {
    if (!this.menuService.isMenuRendered()) {
      return {
        width: '100%',
        left: '0',
        transform: 'none',
      };
    }

    if (!this.showMenuButton) {
      return {
        width: '100%',
        left: '0',
        transform: 'none',
      };
    }

    const state = this.menuService.menuState();
    const isMobile = this.isMobile();
    const isHovering = this.menuService.isHovering();

    if (isMobile) {
      return {
        width: '100%',
        left: '0',
        transform: 'none',
      };
    }

    if (state === MenuState.Collapsed && isHovering) {
      return {
        width: 'calc(100% - 260px)',
        left: '260px',
        transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
      };
    }

    switch (state) {
      case MenuState.Expanded:
        return {
          width: 'calc(100% - 260px)',
          left: '260px',
          transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
        };
      case MenuState.Collapsed:
        return {
          width: 'calc(100% - 80px)',
          left: '80px',
          transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
        };
      case MenuState.Hidden:
      default:
        return {
          width: '100%',
          left: '0',
          transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
        };
    }
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.lastScrollY = window.scrollY;
    }
  }
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.behavior !== 'auto-hide') {
      return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY > this.lastScrollY && currentScrollY > 64) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }

    this.lastScrollY = currentScrollY;
  }

  get headerClasses() {
    return {
      'header--fixed': this.behavior === 'fixed',
      'header--auto-hide': this.behavior === 'auto-hide',
      'header--hidden': this.isHidden && this.behavior === 'auto-hide',
    };
  }

  onMenuClick(): void {
    this.menuButtonClick.emit();
  }
}
