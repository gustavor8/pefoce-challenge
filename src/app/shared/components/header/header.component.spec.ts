import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HeaderComponent, HeaderBehavior } from './header.component';
import { MenuService } from '../../../core/services/menu/menu.service';
import { MenuState } from '../menu/menu.types';

class MockMenuService {
  isMenuRendered = signal(true);
  menuState = signal(MenuState.Hidden);
  isSmallScreen = signal(false);
  isHovering = signal(false);

  setMenuRendered(value: boolean) {
    this.isMenuRendered.set(value);
  }
  setMenuState(state: MenuState) {
    this.menuState.set(state);
  }
  setSmallScreen(value: boolean) {
    this.isSmallScreen.set(value);
  }
  setHovering(value: boolean) {
    this.isHovering.set(value);
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockMenuService: MockMenuService;

  beforeEach(async () => {
    mockMenuService = new MockMenuService();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: MenuService, useValue: mockMenuService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with defaults', () => {
      expect(component.behavior).toBe('fixed');
      expect(component.showMenuButton).toBe(true);
      expect(component.isMenuOpen).toBe(false);
    });
  });

  describe('headerStyles computed', () => {
    beforeEach(() => {
      mockMenuService.setMenuRendered(true);
      mockMenuService.setSmallScreen(false);
      mockMenuService.setHovering(false);
      component.showMenuButton = true;
    });

    it('should return full width when menu not rendered', () => {
      mockMenuService.setMenuRendered(false);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: '100%',
        left: '0',
        transform: 'none',
      });
    });

    it('should return full width on mobile', () => {
      mockMenuService.setSmallScreen(true);
      mockMenuService.setMenuState(MenuState.Expanded);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: '100%',
        left: '0',
        transform: 'none',
      });
    });

    it('should expand on collapsed + hover', () => {
      mockMenuService.setMenuState(MenuState.Collapsed);
      mockMenuService.setHovering(true);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: 'calc(100% - 260px)',
        left: '260px',
        transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
      });
    });

    it('should handle expanded state', () => {
      mockMenuService.setMenuState(MenuState.Expanded);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: 'calc(100% - 260px)',
        left: '260px',
        transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
      });
    });

    it('should handle collapsed state', () => {
      mockMenuService.setMenuState(MenuState.Collapsed);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: 'calc(100% - 80px)',
        left: '80px',
        transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
      });
    });

    it('should handle hidden state', () => {
      mockMenuService.setMenuState(MenuState.Hidden);
      TestBed.flushEffects();

      const styles = component.headerStyles();
      expect(styles).toEqual({
        width: '100%',
        left: '0',
        transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
      });
    });
  });

  describe('Scroll behavior', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
      component['lastScrollY'] = 0;
      component['isHidden'] = false;
    });

    it('should ignore scroll when behavior is not auto-hide', () => {
      component.behavior = 'fixed';
      Object.defineProperty(window, 'scrollY', { value: 100 });

      component.onWindowScroll();

      expect(component['isHidden']).toBe(false);
    });

    it('should hide when scrolling down past threshold', () => {
      component.behavior = 'auto-hide';
      component['lastScrollY'] = 50;
      Object.defineProperty(window, 'scrollY', { value: 100 });

      component.onWindowScroll();

      expect(component['isHidden']).toBe(true);
      expect(component['lastScrollY']).toBe(100);
    });

    it('should show when scrolling up', () => {
      component.behavior = 'auto-hide';
      component['lastScrollY'] = 100;
      Object.defineProperty(window, 'scrollY', { value: 50 });

      component.onWindowScroll();

      expect(component['isHidden']).toBe(false);
    });
  });

  describe('headerClasses getter', () => {
    it('should return correct classes for fixed', () => {
      component.behavior = 'fixed';

      expect(component.headerClasses).toEqual({
        'header--fixed': true,
        'header--auto-hide': false,
        'header--hidden': false,
      });
    });

    it('should return correct classes for auto-hide when hidden', () => {
      component.behavior = 'auto-hide';
      component['isHidden'] = true;

      expect(component.headerClasses).toEqual({
        'header--fixed': false,
        'header--auto-hide': true,
        'header--hidden': true,
      });
    });
  });

  describe('Menu button click', () => {
    it('should emit menuButtonClick', () => {
      spyOn(component.menuButtonClick, 'emit');

      component.onMenuClick();

      expect(component.menuButtonClick.emit).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should set lastScrollY in browser', () => {
      Object.defineProperty(window, 'scrollY', { value: 150 });

      component.ngOnInit();

      expect(component['lastScrollY']).toBe(150);
    });
  });
});
