import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoadingOverlayComponent } from './loading-overlay.component';
import { LoadingOverlayService } from '../../../core/services/loading/loading-overlay.service';
import { LoaderComponent } from '../loader/loader.component';

describe('LoadingOverlayComponent', () => {
  let component: LoadingOverlayComponent;
  let fixture: ComponentFixture<LoadingOverlayComponent>;
  let service: LoadingOverlayService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent, LoaderComponent],

      providers: [LoadingOverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingOverlayComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    service = TestBed.inject(LoadingOverlayService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the overlay initially', () => {
    const overlay = debugElement.query(By.css('.overlay'));
    expect(overlay).toBeFalsy();
  });

  it('should display the overlay when service.show() is called', () => {
    service.show();
    fixture.detectChanges();

    const overlay = debugElement.query(By.css('.overlay'));

    expect(overlay).toBeTruthy();
  });

  it('should hide the overlay when service.hide() is called after being shown', () => {
    service.show();
    fixture.detectChanges();
    let overlay = debugElement.query(By.css('.overlay'));
    expect(overlay).toBeTruthy();

    service.hide();
    fixture.detectChanges();
    overlay = debugElement.query(By.css('.overlay'));
    expect(overlay).toBeFalsy();
  });

  it('should call preventInteraction when the overlay is clicked', () => {
    spyOn(component, 'preventInteraction');

    service.show();
    fixture.detectChanges();

    const overlay = debugElement.query(By.css('.overlay'));
    overlay.triggerEventHandler('click', null);

    expect(component.preventInteraction).toHaveBeenCalled();
  });

  it('preventInteraction method should stop event propagation and prevent default behavior', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'preventDefault');
    spyOn(mockEvent, 'stopPropagation');

    component.preventInteraction(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
