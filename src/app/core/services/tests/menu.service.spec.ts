import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import {
  MenuItem,
  MenuState,
} from '../../../shared/components/menu/menu.types';
import { MenuService } from '../menu.service';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';

const mockRouter = {
  url: '/dashboard',
  events: new Subject<RouterEvent>(),
  navigate: jasmine.createSpy('navigate'),
};

const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Dashboard', route: '/dashboard' },
  {
    id: '2',
    label: 'Nível 1',
    children: [
      { id: '2.1', label: 'Nível 2', route: '/nivel2' },
      {
        id: '2.2',
        label: 'Nível 2 com Filhos',
        children: [{ id: '2.2.1', label: 'Nível 3', route: '/nivel3' }],
      },
    ],
  },
  {
    id: '3',
    label: 'Outro Nível 1',
    children: [{ id: '3.1', label: 'Filho' }],
  },
  { label: 'Item sem ID' },
];

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    TestBed.configureTestingModule({
      providers: [MenuService, { provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(MenuService);
  });

  afterEach(() => {
    service.menuState.set(MenuState.Expanded);
    service.activeSubMenus.set(new Set());
    mockRouter.url = '/dashboard';
  });

  describe('Initialization and State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have a default menuState of Expanded', () => {
      expect(service.menuState()).toBe(MenuState.Expanded);
    });

    it('isMenuExpanded computed signal should reflect the menuState', () => {
      expect(service.isMenuExpanded()).toBe(true);
      service.menuState.set(MenuState.Collapsed);
      expect(service.isMenuExpanded()).toBe(false);
    });

    it('should generate an ID for menu items that dont have one', () => {
      service.setMenuItems(MOCK_MENU_ITEMS);
      const items = service.menuItems();
      const itemWithoutId = items.find((i) => i.label === 'Item sem ID');
      expect(itemWithoutId?.id).toBeDefined();
      expect(itemWithoutId?.id).toContain('menu_id_');
    });
  });

  describe('toggleMenuState Logic', () => {
    describe('on a large screen', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
      });

      it('should toggle from Expanded to Collapsed', () => {
        service.toggleMenuState();
        expect(service.menuState()).toBe(MenuState.Collapsed);
      });

      it('should toggle from Collapsed to Expanded', () => {
        service.menuState.set(MenuState.Collapsed);
        service.toggleMenuState();
        expect(service.menuState()).toBe(MenuState.Expanded);
      });

      it('should restore last state when toggling from Hidden on a large screen', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        service.menuState.set(MenuState.Collapsed);

        Object.defineProperty(window, 'innerWidth', { value: 500 });
        window.dispatchEvent(new Event('resize'));
        expect(service.menuState()).toBe(MenuState.Hidden);

        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        window.dispatchEvent(new Event('resize'));

        service.menuState.set(MenuState.Hidden);
        service.toggleMenuState();
        expect(service.menuState()).toBe(MenuState.Collapsed);
      });
    });

    describe('on a small screen', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', { value: 500 });
        window.dispatchEvent(new Event('resize'));
      });

      it('should toggle from Expanded to Hidden', () => {
        service.menuState.set(MenuState.Expanded);
        service.toggleMenuState();
        expect(service.menuState()).toBe(MenuState.Hidden);
      });

      it('should toggle from Hidden to Expanded', () => {
        service.menuState.set(MenuState.Hidden);
        service.toggleMenuState();
        expect(service.menuState()).toBe(MenuState.Expanded);
      });
    });
  });

  describe('Resize Handling (checkWindowSize)', () => {
    it('should switch to Hidden when resizing to a small screen', () => {
      service.menuState.set(MenuState.Expanded);
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
      expect(service.menuState()).toBe(MenuState.Hidden);
    });

    it('should restore previous state when resizing back to a large screen', () => {
      service.menuState.set(MenuState.Collapsed);
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
      expect(service.menuState()).toBe(MenuState.Hidden);

      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      window.dispatchEvent(new Event('resize'));
      expect(service.menuState()).toBe(MenuState.Collapsed);
    });
  });

  describe('URL/Routing Logic', () => {
    beforeEach(() => {
      service.setMenuItems(MOCK_MENU_ITEMS);
    });

    it('should open parent submenu on navigation to a child route', () => {
      mockRouter.events.next(new NavigationEnd(1, '/nivel3', '/nivel3'));
      const activeSubMenus = service.activeSubMenus();
      expect(activeSubMenus.has('2')).toBe(true);
      expect(activeSubMenus.has('2.2')).toBe(true);
    });

    it('should compare routes with and without leading slash', () => {
      const result1 = (service as any).compareRoutes('route1', '/route1');
      const result2 = (service as any).compareRoutes('/route2', '/route2');
      const result3 = (service as any).compareRoutes(
        ['users', '1'],
        '/users/1'
      );

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });
  });

  describe('toggleSubmenu Logic', () => {
    beforeEach(() => {
      service.setMenuItems(MOCK_MENU_ITEMS);
    });

    it('should open a submenu', () => {
      service.toggleSubmenu('2');
      expect(service.activeSubMenus().has('2')).toBe(true);
    });

    it('should close an open submenu and all its descendants', () => {
      service.activeSubMenus.set(new Set(['2', '2.2']));
      service.toggleSubmenu('2');
      expect(service.activeSubMenus().has('2')).toBe(false);
      expect(service.activeSubMenus().has('2.2')).toBe(false);
    });

    it('should close sibling submenus when another is opened', () => {
      service.toggleSubmenu('2');
      expect(service.activeSubMenus().has('2')).toBe(true);

      service.toggleSubmenu('3');
      expect(service.activeSubMenus().has('3')).toBe(true);
      expect(service.activeSubMenus().has('2')).toBe(false);
    });

    it('should correctly toggle deeply nested submenus', () => {
      service.toggleSubmenu('2');
      expect(service.activeSubMenus().has('2')).toBe(true);

      service.toggleSubmenu('2.2');
      expect(service.activeSubMenus().has('2.2')).toBe(true);

      service.toggleSubmenu('2');
      expect(service.activeSubMenus().has('2')).toBe(false);
      expect(service.activeSubMenus().has('2.2')).toBe(false);
    });
  });

  describe('Computed Signals', () => {
    it('maxActiveDepth should return -1 when no submenus are active', () => {
      service.activeSubMenus.set(new Set());
      expect(service.maxActiveDepth()).toBe(-1);
    });

    it('maxActiveDepth should return correct max depth', () => {
      service.setMenuItems(MOCK_MENU_ITEMS);
      service.activeSubMenus.set(new Set(['2', '2.2']));
      expect(service.maxActiveDepth()).toBe(2);
    });
  });

  describe('Private Helper Methods', () => {
    beforeEach(() => {
      service.setMenuItems(MOCK_MENU_ITEMS);
    });

    it('findItemById should find deeply nested items and return undefined for non-existent IDs', () => {
      const nestedItem = (service as any).findItemById(
        '2.2.1',
        service.menuItems()
      );
      expect(nestedItem).toBeDefined();
      expect(nestedItem.id).toBe('2.2.1');
      expect(nestedItem.label).toBe('Nível 3');

      const nonExistentItem = (service as any).findItemById(
        'non-existent-id',
        service.menuItems()
      );
      expect(nonExistentItem).toBeUndefined();
    });

    it('findSiblingIds should find siblings of deeply nested items', () => {
      const nestedSiblings = (service as any).findSiblingIds(
        '2.2.1',
        service.menuItems()
      );

      const expectedSiblingIds = ['2.2.1'];
      expect(nestedSiblings).toEqual(expectedSiblingIds);

      const parentOfNestedItem = (service as any).findItemById(
        '2.2',
        service.menuItems()
      );
      parentOfNestedItem.children.push({ id: '2.2.2', label: 'Novo Irmão' });

      const newNestedSiblings = (service as any).findSiblingIds(
        '2.2.1',
        service.menuItems()
      );
      expect(newNestedSiblings).toEqual(['2.2.1', '2.2.2']);
    });
  });
});
