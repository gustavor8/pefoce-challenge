import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PopoverComponent } from './popover.component';
import { PopoverTriggerDirective } from '../../directives/popover-trigger.directive';

@Component({
  standalone: true,
  imports: [PopoverComponent, PopoverTriggerDirective],
  template: `
    <button [popoverTriggerFor]="popoverInstance">Click Me</button>
    <app-popover #popover>
      <span>Popover Content</span>
    </app-popover>
    <div id="outside-element">Elemento externo</div>
  `,
})
class TestHostComponent {
  @ViewChild('popover', { static: true }) popoverInstance!: PopoverComponent;
}

describe('Popover Functionality', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let triggerButton: HTMLButtonElement;
  let popoverInstance: PopoverComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    popoverInstance = hostComponent.popoverInstance;
    triggerButton = fixture.debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
  });

  describe('Trigger Interactions', () => {
    it('should create an instance of the directive', () => {
      const directiveInstance = fixture.debugElement
        .query(By.directive(PopoverTriggerDirective))
        .injector.get(PopoverTriggerDirective);
      expect(directiveInstance).toBeTruthy();
    });

    it('should open the popover on trigger click', fakeAsync(() => {
      expect(popoverInstance.isOpen()).toBeFalse();

      triggerButton.click();
      fixture.detectChanges();
      tick();

      expect(popoverInstance.isOpen()).toBeTrue();
      const popoverPanel =
        fixture.nativeElement.querySelector('.popover-panel');
      expect(popoverPanel).not.toBeNull();
    }));

    it('should toggle the popover on consecutive trigger clicks', fakeAsync(() => {
      triggerButton.click();
      fixture.detectChanges();
      tick();
      expect(popoverInstance.isOpen()).toBeTrue();

      triggerButton.click();
      fixture.detectChanges();
      tick(120);
      expect(popoverInstance.isOpen()).toBeFalse();
    }));

    it('should close the popover when clicking outside', fakeAsync(() => {
      triggerButton.click();
      fixture.detectChanges();
      tick();
      expect(popoverInstance.isOpen()).toBeTrue();

      const outsideElement =
        fixture.nativeElement.querySelector('#outside-element');
      outsideElement.click();
      fixture.detectChanges();
      tick(120);

      expect(popoverInstance.isOpen()).toBeFalse();
    }));

    it('should NOT close when clicking inside the popover panel', fakeAsync(() => {
      triggerButton.click();
      fixture.detectChanges();
      tick();
      expect(popoverInstance.isOpen()).toBeTrue();

      const popoverPanel =
        fixture.nativeElement.querySelector('.popover-panel');
      popoverPanel.click();
      fixture.detectChanges();
      tick(120);

      expect(popoverInstance.isOpen()).toBeTrue();
    }));

    it('should close when the Escape key is pressed', fakeAsync(() => {
      triggerButton.click();
      fixture.detectChanges();
      tick();
      expect(popoverInstance.isOpen()).toBeTrue();

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      fixture.detectChanges();
      tick(120);

      expect(popoverInstance.isOpen()).toBeFalse();
    }));

    it('should not try to close if Escape is pressed and it is already closed', () => {
      expect(popoverInstance.isOpen()).toBeFalse();
      spyOn(popoverInstance, 'close');

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      fixture.detectChanges();

      expect(popoverInstance.close).not.toHaveBeenCalled();
    });
  });

  describe('Viewport Collision and Positioning', () => {
    let dummyTrigger: HTMLElement;

    beforeEach(() => {
      dummyTrigger = document.createElement('div');
      document.body.appendChild(dummyTrigger);
    });

    afterEach(() => {
      document.body.removeChild(dummyTrigger);
    });

    const mockBoundingClientRects = (
      triggerRect: Partial<DOMRect>,
      popoverRect: Partial<DOMRect>
    ) => {
      spyOn(dummyTrigger, 'getBoundingClientRect').and.returnValue(
        triggerRect as DOMRect
      );
      if (popoverInstance.popoverPanel?.nativeElement) {
        spyOn(
          popoverInstance.popoverPanel.nativeElement,
          'getBoundingClientRect'
        ).and.returnValue(popoverRect as DOMRect);
      }
    };

    it('should adjust position to avoid overflowing the RIGHT edge', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 });
      const margin = 8;
      popoverInstance.position = 'right';

      popoverInstance.open(dummyTrigger);
      fixture.detectChanges();
      tick();

      mockBoundingClientRects({ right: 780 }, { width: 150 });
      (popoverInstance as any).calculatePosition();

      const expectedLeft = 800 - 150 - margin;
      expect(popoverInstance.popoverStyles().left).toBe(`${expectedLeft}px`);
    }));

    it('should adjust position to avoid overflowing the BOTTOM edge', fakeAsync(() => {
      Object.defineProperty(window, 'innerHeight', { value: 600 });
      const margin = 8;
      popoverInstance.position = 'bottom';

      popoverInstance.open(dummyTrigger);
      fixture.detectChanges();
      tick();

      mockBoundingClientRects({ bottom: 580 }, { height: 150 });
      (popoverInstance as any).calculatePosition();

      const expectedTop = 600 - 150 - margin;
      expect(popoverInstance.popoverStyles().top).toBe(`${expectedTop}px`);
    }));

    it('should adjust position to avoid overflowing the LEFT edge', fakeAsync(() => {
      const margin = 8;
      popoverInstance.position = 'left';

      popoverInstance.open(dummyTrigger);
      fixture.detectChanges();
      tick();

      mockBoundingClientRects({ left: 20 }, { width: 150 });
      (popoverInstance as any).calculatePosition();

      expect(popoverInstance.popoverStyles().left).toBe(`${margin}px`);
    }));

    it('should adjust position to avoid overflowing the TOP edge', fakeAsync(() => {
      const margin = 8;
      popoverInstance.position = 'top';

      popoverInstance.open(dummyTrigger);
      fixture.detectChanges();
      tick();

      mockBoundingClientRects({ top: 20 }, { height: 150 });
      (popoverInstance as any).calculatePosition();

      expect(popoverInstance.popoverStyles().top).toBe(`${margin}px`);
    }));
  });

  describe('calculatePosition Guard Clause', () => {
    it('should not calculate position if popover is not open', () => {
      expect(popoverInstance.isOpen()).toBeFalse();
      spyOn(popoverInstance.popoverStyles, 'set');

      (popoverInstance as any).calculatePosition();

      expect(popoverInstance.popoverStyles.set).not.toHaveBeenCalled();
    });

    it('should not calculate position if triggerElement is missing', () => {
      popoverInstance.isOpen.set(true);
      (popoverInstance as any).triggerElement = undefined;
      spyOn(popoverInstance.popoverStyles, 'set');

      (popoverInstance as any).calculatePosition();

      expect(popoverInstance.popoverStyles.set).not.toHaveBeenCalled();
    });

    it('should not calculate position if popoverPanel is missing', fakeAsync(() => {
      popoverInstance.open(triggerButton);
      fixture.detectChanges();
      tick();

      (popoverInstance as any).popoverPanel = undefined;
      spyOn(popoverInstance.popoverStyles, 'set');

      (popoverInstance as any).calculatePosition();

      expect(popoverInstance.popoverStyles.set).not.toHaveBeenCalled();
    }));
  });

  describe('Method Guard Clauses (open/close)', () => {
    it('should not do anything when open() is called on an already open popover', fakeAsync(() => {
      popoverInstance.open(triggerButton);
      tick();
      spyOn(popoverInstance.isOpen, 'set');

      popoverInstance.open(triggerButton);
      tick();

      expect(popoverInstance.isOpen.set).not.toHaveBeenCalled();
    }));

    it('should not do anything when close() is called on a closed popover', () => {
      expect(popoverInstance.isOpen()).toBeFalse();
      spyOn(popoverInstance.isClosing, 'set');

      popoverInstance.close();

      expect(popoverInstance.isClosing.set).not.toHaveBeenCalled();
    });

    it('should not do anything when close() is called while it is already closing', () => {
      popoverInstance.isOpen.set(true);
      popoverInstance.isClosing.set(true);

      spyOn(popoverInstance as any, 'removeEventListeners');

      popoverInstance.close();

      expect(
        (popoverInstance as any).removeEventListeners
      ).not.toHaveBeenCalled();
    });
  });

  it('should not attempt to close if a document click occurs while popover is closed', () => {
    expect(popoverInstance.isOpen()).toBeFalse();
    spyOn(popoverInstance, 'close');

    const outsideElement =
      fixture.nativeElement.querySelector('#outside-element');
    outsideElement.click();
    fixture.detectChanges();

    expect(popoverInstance.close).not.toHaveBeenCalled();
  });
});
