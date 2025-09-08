import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { MenuItem, MenuState } from '../../shared/components/menu/menu.types';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly breakpoint = 920;
  private lastNonHiddenState: MenuState = MenuState.Expanded;

  private readonly router = inject(Router);

  private readonly _menuItems = signal<MenuItem[]>([]);
  public readonly menuItems = this._menuItems.asReadonly();
  public isHovering = signal(false);

  public readonly isMenuRendered = signal<boolean>(false);
  public menuState = signal<MenuState>(MenuState.Expanded);
  public activeSubMenus = signal(new Set<string>());
  public isMenuExpanded = computed(
    () => this.menuState() === MenuState.Expanded
  );

  public readonly isSmallScreen = signal<boolean>(this._isSmallScreen());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkWindowSize());
      this.checkWindowSize();
    }

    effect(() => {
      const items = this.menuItems();
      if (items.length > 0) {
        this.updateActiveSubMenusFromUrl(this.router.url);
      }
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.updateActiveSubMenusFromUrl(event.urlAfterRedirects);
        this.closeMenuOnMobile();
      });
  }

  private generateId(): string {
    return `menu_id_${Math.random().toString(36).substring(2, 9)}`;
  }

  public closeMenuOnMobile(): void {
    if (this.isSmallScreen()) {
      this.menuState.set(MenuState.Hidden);
    }
  }

  public toggleMenuState(): void {
    if (this.isSmallScreen()) {
      this.menuState.update((currentState) =>
        currentState === MenuState.Expanded
          ? MenuState.Hidden
          : MenuState.Expanded
      );
    } else {
      this.menuState.update((currentState) => {
        if (currentState === MenuState.Hidden) {
          return this.lastNonHiddenState;
        }
        return currentState === MenuState.Expanded
          ? MenuState.Collapsed
          : MenuState.Expanded;
      });
    }
  }

  private _isSmallScreen(): boolean {
    //Ambientes onde não existe o objeto window
    /* istanbul ignore next */
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < this.breakpoint;
  }

  private findItemPathByRoute(
    items: MenuItem[],
    route: string
  ): MenuItem[] | null {
    for (const item of items) {
      if (item.route && this.compareRoutes(item.route, route)) {
        return [item];
      }

      if (item.children) {
        const path = this.findItemPathByRoute(item.children, route);
        if (path) {
          return [item, ...path];
        }
      }
    }
    return null;
  }

  private compareRoutes(itemRoute: string | any[], url: string): boolean {
    const routeString = Array.isArray(itemRoute)
      ? itemRoute.join('/')
      : itemRoute;
    return routeString === url || `/${routeString}` === url;
  }

  private updateActiveSubMenusFromUrl(url: string): void {
    const path = this.findItemPathByRoute(this.menuItems(), url);

    if (path) {
      const parentIds = path.slice(0, -1).map((item) => item.id!);
      this.activeSubMenus.set(new Set(parentIds));
    } else {
      this.activeSubMenus.set(new Set());
    }
  }

  public readonly maxActiveDepth = computed(() => {
    const activeIds = this.activeSubMenus();
    if (activeIds.size === 0) {
      return -1;
    }

    let maxDepth = 0;

    const findDepth = (items: MenuItem[], currentDepth: number) => {
      for (const item of items) {
        if (activeIds.has(item.id!)) {
          if (currentDepth > maxDepth) {
            maxDepth = currentDepth;
          }
        }
        if (item.children) {
          findDepth(item.children, currentDepth + 1);
        }
      }
    };

    findDepth(this.menuItems(), 1);
    return maxDepth;
  });

  private checkWindowSize(): void {
    const isSmall = this._isSmallScreen();
    this.isSmallScreen.set(isSmall);

    if (isSmall) {
      if (this.menuState() !== MenuState.Hidden) {
        this.lastNonHiddenState = this.menuState();
        this.menuState.set(MenuState.Hidden);
      }
    } else {
      if (this.menuState() === MenuState.Hidden) {
        this.menuState.set(this.lastNonHiddenState);
      }
    }
  }

  public setMenuItems(items: MenuItem[]): void {
    const itemsWithIds = this.addIdsToMenuItems(items);
    this._menuItems.set(itemsWithIds);
  }

  private addIdsToMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map((item) => {
      const newItem: MenuItem = { ...item };
      newItem.id = item.id || this.generateId();
      if (item.children && item.children.length > 0) {
        newItem.children = this.addIdsToMenuItems(item.children);
      }
      return newItem;
    });
  }

  private findItemById(id: string, items: MenuItem[]): MenuItem | undefined {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const foundInChildren = this.findItemById(id, item.children);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return undefined;
  }

  private collectAllChildIds(item: MenuItem): string[] {
    const ids: string[] = [];
    if (!item.children || item.children.length === 0) {
      return ids;
    }
    for (const child of item.children) {
      ids.push(child.id!);
      ids.push(...this.collectAllChildIds(child));
    }
    return ids;
  }

  public toggleSubmenu(id: string): void {
    this.activeSubMenus.update((currentSet) => {
      const newSet = new Set(currentSet);
      const isCurrentlyOpen = newSet.has(id);

      if (isCurrentlyOpen) {
        newSet.delete(id);
        const itemToClose = this.findItemById(id, this.menuItems());
        if (itemToClose) {
          const descendantIds = this.collectAllChildIds(itemToClose);
          for (const descendantId of descendantIds) {
            newSet.delete(descendantId);
          }
        }
      } else {
        const siblingIds = this.findSiblingIds(id, this.menuItems());
        for (const siblingId of siblingIds) {
          if (newSet.has(siblingId)) {
            const siblingItem = this.findItemById(siblingId, this.menuItems());
            if (siblingItem) {
              const descendantIds = this.collectAllChildIds(siblingItem);
              for (const descendantId of descendantIds) {
                newSet.delete(descendantId);
              }
            }
            newSet.delete(siblingId);
          }
        }
        newSet.add(id);
      }
      return newSet;
    });
  }

  private findSiblingIds(id: string, items: MenuItem[]): string[] {
    for (const item of items) {
      if (item.children) {
        const isChild = item.children.some((child) => child.id === id);
        if (isChild) {
          return item.children.map((child) => child.id!);
        }
        const siblingIds = this.findSiblingIds(id, item.children);
        if (siblingIds.length > 0) {
          return siblingIds;
        }
      }
    }
    if (items.some((item) => item.id === id)) {
      return items.map((item) => item.id!);
    }
    return [];
  }
}
