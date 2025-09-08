import { provideRouter, Router } from '@angular/router';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem, MenuState } from './menu.types';
import { IconComponent } from '../icon/icon.component';

const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Dashboard', route: '/dashboard', icon: 'house' },
  {
    id: '2',
    label: 'Cadastros',
    icon: 'user',
    children: [
      { id: '2.1', label: 'Usuários', route: '/users' },
      { id: '2.2', label: 'Produtos', route: '/products' },
    ],
  },
  {
    id: '3',
    label: 'Sair',
    action: jasmine.createSpy('actionSpy'),
    icon: 'logout',
  },
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let element: HTMLElement;
  let menuService: MenuService;
  let router: Router;
  let innerWidthSpy: jasmine.Spy;

  beforeEach(async () => {
    innerWidthSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(
      1024
    );

    await TestBed.configureTestingModule({
      imports: [MenuComponent, MenuItemComponent, IconComponent],

      providers: [
        MenuService,
        provideRouter([
          { path: 'dashboard', component: MenuComponent },
          { path: 'users', component: MenuComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    menuService = TestBed.inject(MenuService);
    router = TestBed.inject(Router);

    component.menuItems = MOCK_MENU_ITEMS;
    fixture.detectChanges();
  });

  describe('Rendering And State', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start with ".expanded" class by default', () => {
      expect(element.classList.contains('expanded')).toBeTrue();
    });

    it('should apply ".collapsed" class after toggling state via service', () => {
      expect(element.classList.contains('expanded')).toBeTrue();

      menuService.toggleMenuState();
      fixture.detectChanges();

      expect(element.classList.contains('collapsed')).toBeTrue();
      expect(element.classList.contains('expanded')).toBeFalse();
    });

    it('should render the correct number of menu item from the service', () => {
      const renderedItems = element.querySelectorAll(
        '.menu-content > nav > ul > li'
      );
      expect(renderedItems.length).toBe(MOCK_MENU_ITEMS.length);
    });
  });

  describe('Integration with Service', () => {
    it('should set isHovering to true on mouseenter when collapsed', () => {
      menuService.menuState.set(MenuState.Collapsed);
      fixture.detectChanges();

      element.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(menuService.isHovering()).toBeTrue();
      expect(element.classList.contains('hover-expanded')).toBeTrue();
    });

    it('shoult set the isHovering to false when mouseleave', () => {
      menuService.menuState.set(MenuState.Collapsed);
      menuService.isHovering.set(true);
      fixture.detectChanges();
      expect(element.classList.contains('hover-expanded')).toBeTrue();

      element.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      expect(menuService.isHovering()).toBeFalse();
      expect(element.classList.contains('hover-expanded')).toBeFalse();
    });

    it('should open and close a submenu by clicking its parent', () => {
      const submenuButton = element.querySelector<HTMLButtonElement>(
        'app-menu-item button'
      );
      const submenuDiv = element.querySelector('.submenu');

      expect(submenuButton).toBeTruthy();
      expect(menuService.activeSubMenus().has('2')).toBeFalse();
      expect(submenuDiv?.classList.contains('open')).toBeFalse();

      submenuButton?.click();
      fixture.detectChanges();

      expect(menuService.activeSubMenus().has('2')).toBeTrue();
      expect(submenuDiv?.classList.contains('open')).toBeTrue();

      submenuButton?.click();
      fixture.detectChanges();

      expect(menuService.activeSubMenus().has('2')).toBeFalse();
      expect(submenuDiv?.classList.contains('open')).toBeFalse();
    });

    it('should open the parent submenu automatically based on the current route', fakeAsync(() => {
      expect(menuService.activeSubMenus().has('2')).toBeFalse();

      router.navigateByUrl('/users');
      tick();
      fixture.detectChanges();

      expect(menuService.activeSubMenus().has('2')).toBeTrue();

      const submenuDiv = element.querySelector('.submenu');
      expect(submenuDiv?.classList.contains('open')).toBeTrue();
    }));

    it('should call the item action when an item with an action is clicked', () => {
      const allLinks = Array.from(element.querySelectorAll('app-menu-item a'));
      const actionLink = allLinks.find(
        (el) => el.textContent?.trim() === 'Sair'
      );

      expect(actionLink)
        .withContext('Link de ação "Sair" não foi encontrado')
        .toBeTruthy();

      const actionSpy = MOCK_MENU_ITEMS[2].action as jasmine.Spy;

      (actionLink as HTMLAnchorElement)?.click();
      fixture.detectChanges();

      expect(actionSpy).toHaveBeenCalled();
    });

    it('should allow toggling a submenu when menu is collapsed and hovering', () => {
      spyOn(menuService, 'toggleSubmenu').and.callThrough();

      menuService.toggleMenuState();
      fixture.detectChanges();
      expect(element.classList.contains('collapsed')).toBeTrue();

      element.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      expect(element.classList.contains('hover-expanded')).toBeTrue();

      const submenuButton = element.querySelector<HTMLButtonElement>(
        'app-menu-item button'
      );
      expect(submenuButton?.textContent).toContain('Cadastros');

      submenuButton?.click();
      fixture.detectChanges();

      expect(menuService.toggleSubmenu).toHaveBeenCalledWith('2');
    });
  });

  describe('Backdrop Logic', () => {
    beforeEach(() => {
      // Simula uma tela pequena antes de cada teste neste bloco
      innerWidthSpy.and.returnValue(500);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
    });

    afterEach(() => {
      // Limpa o backdrop do body para não interferir em outros testes
      const backdrop = document.body.querySelector('.menu-backdrop-external');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    });

    it('should create a backdrop when menu is toggled to expanded on a small screen', () => {
      expect(menuService.menuState()).toBe(MenuState.Hidden);

      menuService.toggleMenuState();
      fixture.detectChanges();

      expect(menuService.menuState()).toBe(MenuState.Expanded);
      const backdrop = document.body.querySelector('.menu-backdrop-external');
      expect(backdrop).toBeTruthy();
    });

    it('should not create a second backdrop if one already exists', () => {
      expect(document.body.querySelector('.menu-backdrop-external')).toBeNull();

      menuService.toggleMenuState();
      fixture.detectChanges();
      const firstBackdrop = document.body.querySelector(
        '.menu-backdrop-external'
      );
      expect(firstBackdrop).toBeTruthy();

      (component as any).createBackdrop();
      fixture.detectChanges();

      const allBackdrops = document.body.querySelectorAll(
        '.menu-backdrop-external'
      );
      expect(allBackdrops.length).toBe(1);
    });

    it('should call closeMenuOnMobile when backdrop is clicked', () => {
      menuService.toggleMenuState();
      fixture.detectChanges();

      const backdrop = document.body.querySelector(
        '.menu-backdrop-external'
      ) as HTMLElement;
      expect(backdrop).toBeTruthy();

      backdrop.click();
      fixture.detectChanges();

      expect(menuService.menuState()).toBe(MenuState.Hidden);
    });
  });
});
