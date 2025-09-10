import { Component, DebugElement } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabComponent } from '../tab/tab.component';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <app-tabs [(activeIndex)]="currentTabIndex" [headerAlignment]="alignment">
      <app-tab title="Tab 1" [disabled]="tab1Disabled">Conteúdo 1</app-tab>
      <app-tab title="Tab 2" [disabled]="tab2Disabled">Conteúdo 2</app-tab>
      <app-tab title="Tab 3" [disabled]="tab3Disabled">Conteúdo 3</app-tab>
    </app-tabs>
  `,
})
class TestHostComponent {
  currentTabIndex = 0;
  tab1Disabled = false;
  tab2Disabled = false;
  tab3Disabled = false;
  alignment: 'start' | 'center' | 'end' = 'start';
}

describe('TabsComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let tabsDebugElement: DebugElement;
  let tabsInstance: TabsComponent;
  let nativeElement: HTMLElement;

  const getTabButtons = () =>
    nativeElement.querySelectorAll<HTMLButtonElement>('.tab-header');
  const getActiveTabButton = () =>
    nativeElement.querySelector<HTMLButtonElement>('.tab-header.active');
  const getTabPanelContent = () =>
    nativeElement.querySelector('.tab-panel')?.textContent?.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TabsComponent, TabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    tabsDebugElement = fixture.debugElement.query(By.directive(TabsComponent));
    tabsInstance = tabsDebugElement.componentInstance;
    nativeElement = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(tabsInstance).toBeTruthy();
  });

  describe('Initial State and Rendering', () => {
    it('should render three tab headers', () => {
      const tabButtons = getTabButtons();
      expect(tabButtons.length).toBe(3);
      expect(tabButtons[0].textContent).toContain('Tab 1');
      expect(tabButtons[1].textContent).toContain('Tab 2');
      expect(tabButtons[2].textContent).toContain('Tab 3');
    });

    it('should have the first tab active by default', () => {
      const activeTab = getActiveTabButton();
      expect(activeTab?.textContent).toContain('Tab 1');
      expect(getTabPanelContent()).toBe('Conteúdo 1');
    });

    it('should apply header alignment class based on input', fakeAsync(() => {
      hostComponent.alignment = 'center';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tabList = nativeElement.querySelector('.tab-list');
      expect(tabList?.classList.contains('align-center')).toBeTrue();
    }));
  });

  describe('User Interaction and Tab Selection', () => {
    it('should switch to the third tab on click', () => {
      const tabButtons = getTabButtons();
      tabButtons[2].click();
      fixture.detectChanges();

      const activeTab = getActiveTabButton();
      expect(activeTab?.textContent).toContain('Tab 3');
      expect(getTabPanelContent()).toBe('Conteúdo 3');
      expect(hostComponent.currentTabIndex).toBe(2);
    });

    it('should not switch to a disabled tab on click', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      const tabButtons = getTabButtons();
      tabButtons[1].click();
      fixture.detectChanges();

      const activeTab = getActiveTabButton();
      expect(activeTab?.textContent).toContain('Tab 1');
      expect(hostComponent.currentTabIndex).toBe(0);
    });

    it('should update the host component activeIndex via two-way binding', () => {
      tabsInstance.selectTab(1);
      fixture.detectChanges();

      expect(hostComponent.currentTabIndex).toBe(1);
    });

    it('should emit tabChange event with the tab title on selection', () => {
      spyOn(tabsInstance.tabChange, 'emit');

      const tabButtons = getTabButtons();
      tabButtons[1].click();
      fixture.detectChanges();

      expect(tabsInstance.tabChange.emit).toHaveBeenCalledWith('Tab 2');
    });
  });

  describe('Reactivity and Edge Cases', () => {
    it('should fall back to the first enabled tab if the active tab becomes disabled', fakeAsync(() => {
      expect(tabsInstance.activeIndex()).toBe(0);

      hostComponent.tab1Disabled = true;
      fixture.detectChanges();

      tick();
      fixture.detectChanges();

      expect(tabsInstance.activeIndex()).toBe(1);
      expect(getActiveTabButton()?.textContent).toContain('Tab 2');
    }));
  });

  describe('Keyboard Navigation', () => {
    it('should move to the next tab with ArrowRight', () => {
      const tabButtons = getTabButtons();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(getActiveTabButton()?.textContent).toContain('Tab 2');
    });

    it('should not change active tab with End key when all tabs are disabled', () => {
      hostComponent.currentTabIndex = 0;

      hostComponent.tab1Disabled = true;
      hostComponent.tab2Disabled = true;
      hostComponent.tab3Disabled = true;
      fixture.detectChanges();

      const tabButtons = getTabButtons();
      const event = new KeyboardEvent('keydown', { key: 'End' });

      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(tabsInstance.activeIndex()).toBe(0);
    });

    it('should move to the previous tab with ArrowLeft', () => {
      const tabButtons = getTabButtons();

      tabButtons[1].click();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      tabButtons[1].dispatchEvent(event);
      fixture.detectChanges();

      expect(getActiveTabButton()?.textContent).toContain('Tab 1');
    });

    it('should not change tab on unhandled key press', () => {
      const tabButtons = getTabButtons();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(tabsInstance.activeIndex()).toBe(0);
      expect(getActiveTabButton()?.textContent).toContain('Tab 1');
    });

    it('should not change tab with Home key when all tabs are disabled', () => {
      hostComponent.currentTabIndex = 0;
      fixture.detectChanges();

      hostComponent.tab1Disabled = true;
      hostComponent.tab2Disabled = true;
      hostComponent.tab3Disabled = true;
      fixture.detectChanges();

      const tabButtons = getTabButtons();
      const event = new KeyboardEvent('keydown', { key: 'Home' });

      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(tabsInstance.activeIndex()).toBe(0);
    });

    it('should skip a disabled tab with ArrowRight', () => {
      hostComponent.tab2Disabled = true;
      fixture.detectChanges();

      const tabButtons = getTabButtons();
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(getActiveTabButton()?.textContent).toContain('Tab 3');
    });

    it('should move to the first enabled tab with Home key', () => {
      const tabButtons = getTabButtons();
      tabButtons[2].click();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      tabButtons[2].dispatchEvent(event);
      fixture.detectChanges();

      expect(getActiveTabButton()?.textContent).toContain('Tab 1');
    });

    it('should move to the last enabled tab with End key', () => {
      const tabButtons = getTabButtons();
      const event = new KeyboardEvent('keydown', { key: 'End' });
      tabButtons[0].dispatchEvent(event);
      fixture.detectChanges();

      expect(getActiveTabButton()?.textContent).toContain('Tab 3');
    });
  });
});
