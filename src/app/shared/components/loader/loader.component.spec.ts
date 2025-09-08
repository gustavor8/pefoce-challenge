import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoaderComponent, LoaderSize, LoaderVariant } from './loader.component';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  template: ` <app-loader [variant]="variant" [size]="size"> </app-loader> `,
})
class TestHostComponent {
  variant: LoaderVariant = 'default';
  size: LoaderSize = 'md';
}

describe('LoaderComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let loaderDebugElement: DebugElement;
  let loaderNativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, LoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    loaderDebugElement = fixture.debugElement.query(
      By.directive(LoaderComponent)
    );
    loaderNativeElement = loaderDebugElement.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    const loaderInstance = loaderDebugElement.componentInstance;
    expect(loaderInstance).toBeTruthy();
  });

  describe('Inputs and Rendering', () => {
    it('should apply default variant and size when no inputs are provided', () => {
      const fixture = TestBed.createComponent(LoaderComponent);
      fixture.detectChanges();

      const loaderNativeElement = fixture.nativeElement;
      const wrapperEl = loaderNativeElement.querySelector('.spin-wrapper');
      const svgEl = loaderNativeElement.querySelector('svg');

      expect(wrapperEl?.classList.contains('variant-default')).toBeTrue();
      expect(svgEl?.style.width).toBe('70px');
      expect(svgEl?.style.height).toBe('70px');
    });

    it('should apply the "neutral" variant class', () => {
      hostComponent.variant = 'neutral';
      fixture.detectChanges();

      const wrapperEl = loaderNativeElement.querySelector('.spin-wrapper');
      expect(wrapperEl?.classList.contains('variant-neutral')).toBeTrue();
      expect(wrapperEl?.classList.contains('variant-default')).toBeFalse();
    });

    it('should set size to "sm" (45px)', () => {
      hostComponent.size = 'sm';
      fixture.detectChanges();

      const svgEl = loaderNativeElement.querySelector('svg');
      expect(svgEl?.style.width).toBe('45px');
      expect(svgEl?.style.height).toBe('45px');
    });

    it('should set size to "md" (70px)', () => {
      hostComponent.size = 'md';
      fixture.detectChanges();

      const svgEl = loaderNativeElement.querySelector('svg');
      expect(svgEl?.style.width).toBe('70px');
      expect(svgEl?.style.height).toBe('70px');
    });

    it('should set size to "lg" (110px)', () => {
      hostComponent.size = 'lg';
      fixture.detectChanges();

      const svgEl = loaderNativeElement.querySelector('svg');
      expect(svgEl?.style.width).toBe('110px');
      expect(svgEl?.style.height).toBe('110px');
    });
    it('should default to "md" (70px) when an invalid size is provided', () => {
      hostComponent.size = 'some-invalid-value' as any;
      fixture.detectChanges();

      const svgEl = loaderNativeElement.querySelector('svg');
      expect(svgEl?.style.width).toBe('70px');
      expect(svgEl?.style.height).toBe('70px');
    });
  });
});
