import {
  Component,
  signal,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'popover',
})
export class PopoverComponent {
  readonly isOpen = signal(false);
  readonly isClosing = signal(false);

  @ViewChild('popoverPanel') popoverPanel!: ElementRef<HTMLDivElement>;

  @Input() position: PopoverPosition = 'right';

  private triggerElement!: HTMLElement;
  popoverStyles = signal<{ top: string; left: string }>({
    top: '0',
    left: '0',
  });
  actualPlacement = signal<PopoverPosition>('right');

  private boundReposition: () => void = () => {};
  private isRepositioning = false;

  open(trigger: HTMLElement) {
    if (this.isOpen()) return;

    this.triggerElement = trigger;
    this.isOpen.set(true);

    setTimeout(() => {
      this.calculatePosition();
      this.addEventListeners();
    }, 0);
  }

  close() {
    if (!this.isOpen() || this.isClosing()) return;

    this.removeEventListeners();
    this.isClosing.set(true);

    setTimeout(() => {
      this.isOpen.set(false);
      this.isClosing.set(false);
    }, 120);
  }

  toggle(trigger: HTMLElement) {
    this.isOpen() ? this.close() : this.open(trigger);
  }

  private addEventListeners() {
    this.boundReposition = this.reposition.bind(this);
    window.addEventListener('scroll', this.boundReposition, true);
    window.addEventListener('resize', this.boundReposition, true);
  }

  private removeEventListeners() {
    window.removeEventListener('scroll', this.boundReposition, true);
    window.removeEventListener('resize', this.boundReposition, true);
  }

  private reposition() {
    if (!this.isRepositioning) {
      this.isRepositioning = true;
      requestAnimationFrame(() => {
        this.calculatePosition();
        this.isRepositioning = false;
      });
    }
  }

  // popover.component.ts

  private calculatePosition() {
    if (!this.isOpen() || !this.triggerElement || !this.popoverPanel) {
      return;
    }

    const triggerRect = this.triggerElement.getBoundingClientRect();
    const popoverRect = this.popoverPanel.nativeElement.getBoundingClientRect();
    const margin = 8;

    const fallbackSequences: Record<PopoverPosition, PopoverPosition[]> = {
      bottom: ['bottom', 'top', 'right', 'left'],
      top: ['top', 'bottom', 'right', 'left'],
      right: ['right', 'left', 'top', 'bottom'],
      left: ['left', 'right', 'top', 'bottom'],
    };

    const getPositionStyles = (placement: PopoverPosition) => {
      switch (placement) {
        case 'bottom':
          return {
            top: triggerRect.bottom + margin,
            left: triggerRect.right - popoverRect.width,
          };
        case 'top':
          return {
            top: triggerRect.top - popoverRect.height - margin,
            left: triggerRect.right - popoverRect.width,
          };
        case 'right':
          return {
            top: triggerRect.top,
            left: triggerRect.right + margin,
          };
        case 'left':
          return {
            top: triggerRect.top,
            left: triggerRect.left - popoverRect.width - margin,
          };
      }
    };

    const sequence = fallbackSequences[this.position];
    let finalPlacement: PopoverPosition | null = null;
    let finalTop = 0;
    let finalLeft = 0;

    for (const placement of sequence) {
      const { top, left } = getPositionStyles(placement);

      const fitsOnScreen =
        top >= margin &&
        left >= margin &&
        top + popoverRect.height <= window.innerHeight - margin &&
        left + popoverRect.width <= window.innerWidth - margin;

      if (fitsOnScreen) {
        finalPlacement = placement;
        finalTop = top;
        finalLeft = left;
        break;
      }
    }

    if (finalPlacement === null) {
      finalPlacement = this.position;
      const initialStyles = getPositionStyles(finalPlacement);
      finalTop = initialStyles.top;
      finalLeft = initialStyles.left;
    }

    if (finalLeft < margin) {
      finalLeft = margin;
    }
    if (finalLeft + popoverRect.width > window.innerWidth - margin) {
      finalLeft = window.innerWidth - popoverRect.width - margin;
    }
    if (finalTop < margin) {
      finalTop = margin;
    }
    if (finalTop + popoverRect.height > window.innerHeight - margin) {
      finalTop = window.innerHeight - popoverRect.height - margin;
    }

    this.actualPlacement.set(finalPlacement);
    this.popoverStyles.set({ top: `${finalTop}px`, left: `${finalLeft}px` });
  }
}
