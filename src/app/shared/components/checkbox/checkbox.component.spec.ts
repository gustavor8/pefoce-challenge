import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';
import { By } from '@angular/platform-browser';

// Hospedeiro para testar a integração com formulários reativos e inputs
@Component({
  standalone: true,
  imports: [CheckboxComponent, ReactiveFormsModule],
  template: `
    <app-checkbox
      [formControl]="checkboxControl"
      [label]="label"
      [labelPosition]="labelPosition"
      [indeterminate]="indeterminate"
      [errorMessages]="{ required: 'Este campo é obrigatório.' }"
    ></app-checkbox>
  `,
})
class TestHostComponent {
  checkboxControl = new FormControl(false, Validators.requiredTrue);
  label = 'Aceito os termos';
  labelPosition: 'before' | 'after' = 'after';
  indeterminate = false;
}

describe('CheckboxComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let checkboxDebugEl: DebugElement;
  let checkboxInstance: CheckboxComponent;
  let checkboxNativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CheckboxComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    checkboxDebugEl = fixture.debugElement.query(By.directive(CheckboxComponent));
    checkboxInstance = checkboxDebugEl.componentInstance;
    checkboxNativeElement = checkboxDebugEl.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(checkboxInstance).toBeTruthy();
  });

  describe('Rendering and Inputs', () => {
    it('should display the label text correctly', () => {
      const labelEl = checkboxNativeElement.querySelector('.checkbox-label');
      expect(labelEl?.textContent).toContain('Aceito os termos');
    });

    it('should display the label after the checkbox by default', () => {
      const container = checkboxNativeElement.querySelector('.checkbox-container');
      const firstChild = container?.firstElementChild;
      expect(firstChild?.classList.contains('checkbox-element')).toBeTrue();
    });

    it('should display the label before the checkbox when labelPosition is "before"', () => {
      hostComponent.labelPosition = 'before';
      fixture.detectChanges();

      const container = checkboxNativeElement.querySelector('.checkbox-container');
      const firstChild = container?.firstElementChild;
      expect(firstChild?.classList.contains('checkbox-label')).toBeTrue();
    });

    it('should show indeterminate state when indeterminate input is true', () => {
      hostComponent.indeterminate = true;
      fixture.detectChanges();

      const indeterminateMark = checkboxNativeElement.querySelector('.checkbox-indeterminate-mark');
      const checkmark = checkboxNativeElement.querySelector('.checkbox-checkmark');

      expect(indeterminateMark).toBeTruthy();
      expect(checkmark).toBeFalsy();
      expect(checkboxNativeElement.querySelector('.checkbox-element')?.classList).toContain('indeterminate');
    });
  });

  describe('User Interaction', () => {
    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBeFalse();

      checkboxNativeElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBeTrue();
      expect(hostComponent.checkboxControl.value).toBeTrue();

      checkboxNativeElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBeFalse();
      expect(hostComponent.checkboxControl.value).toBeFalse();
    });

    it('should toggle checked state on Space keydown', () => {
      expect(checkboxInstance.checked).toBeFalse();
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });

      checkboxNativeElement.dispatchEvent(spaceEvent);
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBeTrue();
      expect(hostComponent.checkboxControl.value).toBeTrue();
    });

    it('should not toggle when disabled', () => {
      hostComponent.checkboxControl.disable();
      fixture.detectChanges();

      spyOn(checkboxInstance.checkChange, 'emit');

      checkboxNativeElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBeFalse();
      expect(checkboxInstance.checkChange.emit).not.toHaveBeenCalled();
    });

    it('should apply focus and blur classes', () => {
      checkboxNativeElement.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(checkboxNativeElement.classList.contains('focused')).toBeTrue();

      checkboxNativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(checkboxNativeElement.classList.contains('focused')).toBeFalse();
    });

    it('should remove indeterminate state on click', () => {
      hostComponent.indeterminate = true;
      fixture.detectChanges();
      expect(checkboxInstance.indeterminate).toBeTrue();

      checkboxNativeElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBeFalse();
      expect(checkboxInstance.checked).toBeTrue();
    });
  });

  describe('ControlValueAccessor and Reactive Forms Integration', () => {
    it('should update the view when the form control value changes', () => {
      hostComponent.checkboxControl.setValue(true);
      fixture.detectChanges();
      expect(checkboxInstance.checked).toBeTrue();

      hostComponent.checkboxControl.setValue(false);
      fixture.detectChanges();
      expect(checkboxInstance.checked).toBeFalse();
    });

    it('should update the form control value when the view changes (on click)', () => {
        checkboxNativeElement.click();
        fixture.detectChanges();
        expect(hostComponent.checkboxControl.value).toBe(true);
    });

    it('should set the disabled state from the form control', () => {
        hostComponent.checkboxControl.disable();
        fixture.detectChanges();
        expect(checkboxInstance.disabled).toBeTrue();
        expect(checkboxNativeElement.classList.contains('is-disabled')).toBeTrue();

        hostComponent.checkboxControl.enable();
        fixture.detectChanges();
        expect(checkboxInstance.disabled).toBeFalse();
        expect(checkboxNativeElement.classList.contains('is-disabled')).toBeFalse();
    });

    it('should mark the form control as touched on blur', () => {
        expect(hostComponent.checkboxControl.touched).toBeFalse();
        checkboxNativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(hostComponent.checkboxControl.touched).toBeTrue();
    });
  });

  describe('Validation and Error Handling', () => {
    it('should not show an error if control is valid and untouched', () => {
      const errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(errorEl).toBeFalsy();
      expect(checkboxInstance.hasError).toBeFalse();
    });

    it('should show the specific error message when control is invalid and touched', () => {
      hostComponent.checkboxControl.setValue(false); // Garante que é inválido (requiredTrue)
      checkboxNativeElement.dispatchEvent(new Event('blur')); // Marca como touched
      fixture.detectChanges();

      const errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(checkboxInstance.hasError).toBeTrue();
      expect(errorEl).toBeTruthy();
      expect(errorEl?.textContent?.trim()).toBe('Este campo é obrigatório.');
    });

    it('should NOT show an error message if control is invalid but untouched', () => {
      hostComponent.checkboxControl.setValue(false); // Inválido
      fixture.detectChanges();

      const errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(checkboxInstance.hasError).toBeFalse();
      expect(errorEl).toBeFalsy();
    });

    it('should show a generic error message if a specific one is not provided', () => {
      hostComponent.checkboxControl.setErrors({ anotherError: true });
      checkboxNativeElement.dispatchEvent(new Event('blur')); // Marca como touched
      fixture.detectChanges();

      const errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(checkboxInstance.hasError).toBeTrue();
      expect(errorEl).toBeTruthy();
      expect(errorEl?.textContent?.trim()).toBe('Erro de validação: anotherError');
    });

    it('should hide the error message when the control becomes valid again', () => {
      hostComponent.checkboxControl.setValue(false);
      checkboxNativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      let errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(errorEl).toBeTruthy(); // Confirma que o erro está visível

      hostComponent.checkboxControl.setValue(true); // Torna o controle válido
      fixture.detectChanges();

      errorEl = checkboxNativeElement.querySelector('.error-message');
      expect(checkboxInstance.hasError).toBeFalse();
      expect(errorEl).toBeFalsy();
    });
  });
});
