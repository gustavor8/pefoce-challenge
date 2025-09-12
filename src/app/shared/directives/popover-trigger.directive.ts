import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { PopoverComponent } from '../components/popover/popover.component';

@Directive({
  selector: '[popoverTriggerFor]',
  standalone: true,
})
export class PopoverTriggerDirective {
  @Input('popoverTriggerFor') popover!: PopoverComponent;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('click')
  onClick() {
    this.popover.toggle(this.elementRef.nativeElement);
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement) {
    if (!this.popover.isOpen()) {
      return;
    }

    const isTriggerClick = this.elementRef.nativeElement.contains(target);

    const isPopoverClick =
      this.popover.popoverPanel?.nativeElement.contains(target);

    if (!isTriggerClick && !isPopoverClick) {
      this.popover.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.popover.isOpen()) {
      this.popover.close();
    }
  }
}
