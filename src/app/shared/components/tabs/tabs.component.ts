import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  computed,
  effect,
  model,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { TabComponent } from '../tab/tab.component';

export type TabHeaderAlignment = 'start' | 'center' | 'end';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements AfterContentInit, AfterContentChecked {
  @ContentChildren(TabComponent)
  private tabComponents!: QueryList<TabComponent>;
  @ViewChildren('tabButton') private tabButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  @Input() headerAlignment: TabHeaderAlignment = 'start';
  public activeIndex = model<number>(0);

  @Output() tabChange = new EventEmitter<string>();

  public tabs = signal<TabComponent[]>([]);

  public activeTab = computed<TabComponent | undefined>(() => {
    const tabs = this.tabs();
    const index = this.activeIndex();
    return tabs[index];
  });

  public indicatorWidth = signal<number>(0);
  public indicatorPosition = signal<number>(0);

  constructor() {
    effect(() => {
      const currentActiveTab = this.activeTab();

      this.tabs().forEach((tab, index) =>
        tab.isActive.set(index === this.activeIndex())
      );

      if (currentActiveTab) {
        this.tabChange.emit(currentActiveTab.title);
        this.updateIndicator();
      }
    });
  }

  ngAfterContentInit() {
    const updateTabs = (tabsQuery: QueryList<TabComponent>) => {
      this.tabs.set(tabsQuery.toArray());
    };

    updateTabs(this.tabComponents);
    this.tabComponents.changes.subscribe(updateTabs);
  }

  ngAfterContentChecked() {
    const activeTab = this.activeTab();

    if (activeTab && activeTab.disabled) {
      const firstEnabledIndex = this.tabs().findIndex((tab) => !tab.disabled);

      if (this.activeIndex() !== firstEnabledIndex) {
        setTimeout(() => {
          this.activeIndex.set(
            firstEnabledIndex !== -1 ? firstEnabledIndex : 0
          );
        });
      }
    }
  }

  updateIndicator() {
    requestAnimationFrame(() => {
      const tabButton =
        this.tabButtons.toArray()[this.activeIndex()]?.nativeElement;
      if (tabButton) {
        this.indicatorWidth.set(tabButton.offsetWidth);
        this.indicatorPosition.set(tabButton.offsetLeft);
      }
    });
  }

  selectTab(index: number) {
    const tab = this.tabs()[index];
    if (tab && !tab.disabled) {
      this.activeIndex.set(index);
    }
  }

  onKeydown(event: KeyboardEvent, currentIndex: number) {
    const key = event.key;
    if (
      key !== 'ArrowRight' &&
      key !== 'ArrowLeft' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }

    event.preventDefault();
    const tabsArray = this.tabs();
    let nextIndex = currentIndex;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      const direction = key === 'ArrowRight' ? 1 : -1;
      do {
        nextIndex =
          (nextIndex + direction + tabsArray.length) % tabsArray.length;
      } while (tabsArray[nextIndex].disabled && nextIndex !== currentIndex);
    } else if (key === 'Home') {
      nextIndex = tabsArray.findIndex((t) => !t.disabled) ?? 0;
    } else if (key === 'End') {
      const reversedTabs = [...tabsArray].reverse();
      const lastEnabled = reversedTabs.find((t) => !t.disabled);
      nextIndex = lastEnabled
        ? tabsArray.indexOf(lastEnabled)
        : tabsArray.length - 1;
    }

    if (nextIndex !== currentIndex) {
      this.selectTab(nextIndex);
      setTimeout(() =>
        this.tabButtons.toArray()[nextIndex]?.nativeElement.focus()
      );
    }
  }
}
