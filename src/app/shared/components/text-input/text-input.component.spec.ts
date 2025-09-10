import { Component, DebugElement, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMask, TextInputComponent } from './text-input.component';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  template: `
    <app-text-input
      #textInput
      [formControl]="textControl"
      [label]="label"
      [type]="type"
      [placeholder]="placeholder"
      [helperText]="helperText"
      [icon]="icon"
      [iconPosition]="iconPosition"
      [mask]="mask"
      [maxLength]="maxLength"
      [showCharCounter]="showCharCounter"
      [errorMessages]="errorMessages"
      [readonly]="readonly"
    ></app-text-input>
  `,
})
class TestHostComponent {
  @ViewChild('textInput') textInputInstance!: TextInputComponent;

  textControl = new FormControl('');
  label = 'Test Label';
  type: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' = 'text';
  placeholder = 'Enter text...';
  helperText = '';
  icon?: any;
  iconPosition: 'prefix' | 'suffix' = 'prefix';
  mask?: InputMask;
  maxLength?: number;
  showCharCounter = false;
  readonly = false;
  errorMessages: { [key: string]: string } = {
    required: 'This field is required',
    minlength: 'Too short',
  };
}

describe('TextInputComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let textInputDebugElement: DebugElement;
  let textInputInstance: TextInputComponent;
  let textInputNativeElement: HTMLElement;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TestHostComponent, TextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    textInputDebugElement = fixture.debugElement.query(
      By.directive(TextInputComponent)
    );
    textInputInstance = textInputDebugElement.componentInstance;
    textInputNativeElement = textInputDebugElement.nativeElement;

    fixture.detectChanges();

    inputElement = textInputNativeElement.querySelector(
      '.text-input-field'
    ) as HTMLInputElement;
  });

  it('should create', () => {
    expect(textInputInstance).toBeTruthy();
  });

  describe('Rendering and Inputs', () => {
    it('should display the label and placeholder', () => {
      const labelEl = textInputNativeElement.querySelector('.text-input-label');
      expect(labelEl?.textContent).toContain('Test Label');
      expect(inputElement.placeholder).toBe('Enter text...');
    });

    it('should display helper text and not the error message container', () => {
      hostComponent.helperText = 'Some helpful advice';
      fixture.detectChanges();
      const helperEl = textInputNativeElement.querySelector('.helper-text');
      const errorEl = textInputNativeElement.querySelector('.error-message');
      expect(helperEl?.textContent).toContain('Some helpful advice');
      expect(errorEl).toBeNull();
    });

    it('should display a prefix icon', () => {
      hostComponent.icon = 'search';
      hostComponent.iconPosition = 'prefix';
      fixture.detectChanges();
      const prefixIcon = textInputNativeElement.querySelector('.prefix-icon');
      expect(prefixIcon).not.toBeNull();
    });

    it('should display a suffix icon', () => {
      hostComponent.icon = 'check';
      hostComponent.iconPosition = 'suffix';
      fixture.detectChanges();
      const suffixIcon = textInputNativeElement.querySelector('.suffix-icon');
      expect(suffixIcon).not.toBeNull();
    });
  });

  describe('User Interaction', () => {
    it('should update value on user input', () => {
      inputElement.value = 'hello world';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(textInputInstance.value).toBe('hello world');
      expect(hostComponent.textControl.value).toBe('hello world');
    });

    it('should apply focus and blur classes correctly', () => {
      inputElement.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(textInputNativeElement.classList.contains('focused')).toBeTrue();

      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(textInputNativeElement.classList.contains('focused')).toBeFalse();
    });

    it('should return early from onInputChange if cursor position is null', () => {
      const onChangeSpy = spyOn(textInputInstance, 'onChange');
      const mockInput = document.createElement('input');
      Object.defineProperty(mockInput, 'selectionStart', {
        get: () => null,
      });
      const mockEvent = { target: mockInput } as unknown as Event;

      textInputInstance.onInputChange(mockEvent);

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('should emit suffixIconClick event when onSuffixClick is called', () => {
      const spy = spyOn(textInputInstance.suffixIconClick, 'emit');
      const mockEvent = new MouseEvent('click');

      textInputInstance.onSuffixClick(mockEvent);

      expect(spy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('ControlValueAccessor Integration', () => {
    it('should update the view when form control value changes', () => {
      hostComponent.textControl.setValue('new value from control');
      fixture.detectChanges();
      expect(inputElement.value).toBe('new value from control');
    });

    it('should disable the input when form control is disabled', () => {
      hostComponent.textControl.disable();
      fixture.detectChanges();
      expect(inputElement.disabled).toBeTrue();
      expect(
        textInputNativeElement.classList.contains('is-disabled')
      ).toBeTrue();
    });

    it('should mark the form control as touched on blur', () => {
      expect(hostComponent.textControl.touched).toBeFalse();
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(hostComponent.textControl.touched).toBeTrue();
    });
  });

  describe('inputMode Attribute', () => {
    it('should set inputmode to "numeric" when type is "tel"', () => {
      hostComponent.type = 'tel';
      fixture.detectChanges();
      expect(inputElement.getAttribute('inputmode')).toBe('numeric');
    });

    it('should set inputmode to "email" when type is "email"', () => {
      hostComponent.type = 'email';
      fixture.detectChanges();
      expect(inputElement.getAttribute('inputmode')).toBe('email');
    });

    it('should set inputmode to "url" when type is "url"', () => {
      hostComponent.type = 'url';
      fixture.detectChanges();
      expect(inputElement.getAttribute('inputmode')).toBe('url');
    });
  });

  describe('Masking Edge Cases', () => {
    it('should update view value even if cursor position is null when mask is active', fakeAsync(() => {
      const testMask: InputMask = {
        maskFn: (value: string) => `masked-${value}`,
        allowedCharsRegex: /[0-9]/,
      };
      hostComponent.mask = testMask;
      fixture.detectChanges();

      spyOnProperty(inputElement, 'selectionStart', 'get').and.returnValue(
        null
      );

      inputElement.value = 'a1b2c3d4';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      tick();

      expect(hostComponent.textControl.value).toBe('1234');
      expect(inputElement.value).toBe('masked-1234');
    }));
  });

  describe('MaxLength Handling', () => {
    it('should truncate input for default type (text/email) when exceeding maxLength', () => {
      hostComponent.type = 'text';
      hostComponent.maxLength = 5;
      fixture.detectChanges();

      inputElement.value = '1234567';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(hostComponent.textControl.value).toBe('12345');
      expect(inputElement.value).toBe('12345');
    });

    it('should truncate raw model value when exceeding maxLength with a mask', fakeAsync(() => {
      const simpleMask: InputMask = {
        maskFn: (value: string) => `M-${value}`,
        allowedCharsRegex: /[0-9]/,
      };
      hostComponent.mask = simpleMask;
      hostComponent.maxLength = 4;
      fixture.detectChanges();

      inputElement.value = '123456';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      expect(hostComponent.textControl.value).toBe('1234');
      expect(inputElement.value).toBe('M-1234');
    }));
  });

  describe('Validation and Error Handling', () => {
    beforeEach(() => {
      hostComponent.textControl.setValidators(Validators.required);
      hostComponent.textControl.updateValueAndValidity();
      fixture.detectChanges();
    });

    it('should not show an error if the control is untouched', () => {
      hostComponent.textControl.setValue('');
      fixture.detectChanges();
      const errorEl = textInputNativeElement.querySelector('.error-message');
      expect(errorEl).toBeNull();
    });

    it('should show an error if the control is invalid and touched', () => {
      hostComponent.textControl.setValue('');
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      const errorEl = textInputNativeElement.querySelector('.error-message');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('This field is required');
      expect(textInputNativeElement.classList.contains('has-error')).toBeTrue();
    });

    it('should display a default error message if a custom one is not provided', () => {
      hostComponent.errorMessages = {};
      const customError = { somethingWrong: true };
      hostComponent.textControl.setErrors(customError);
      fixture.detectChanges();
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      const errorEl = textInputNativeElement.querySelector('.error-message');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe(
        'Erro no campo: somethingWrong'
      );
    });

    it('should hide the error when the control becomes valid', () => {
      hostComponent.textControl.setValue('');
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(
        textInputNativeElement.querySelector('.error-message')
      ).not.toBeNull();

      inputElement.value = 'valid input';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(textInputNativeElement.querySelector('.error-message')).toBeNull();
      expect(
        textInputNativeElement.classList.contains('has-error')
      ).toBeFalse();
    });
  });

  describe('Feature-Specific Tests', () => {
    describe('Password Type', () => {
      beforeEach(() => {
        hostComponent.type = 'password';
        fixture.detectChanges();
      });

      it('should render a password toggle button', () => {
        const toggleButton =
          textInputNativeElement.querySelector('.suffix-button');
        expect(toggleButton).not.toBeNull();
      });

      it('should toggle input type between password and text', () => {
        expect(inputElement.type).toBe('password');
        expect(textInputInstance.passwordToggleIcon).toBe('eyeOff');

        textInputInstance.togglePasswordVisibility();
        fixture.detectChanges();

        expect(inputElement.type).toBe('text');
        expect(textInputInstance.passwordToggleIcon).toBe('eye');

        textInputInstance.togglePasswordVisibility();
        fixture.detectChanges();

        expect(inputElement.type).toBe('password');
        expect(textInputInstance.passwordToggleIcon).toBe('eyeOff');
      });
    });

    describe('Input Type "number"', () => {
      beforeEach(() => {
        hostComponent.type = 'number';
        fixture.detectChanges();
      });

      it('should filter out non-numeric characters', () => {
        inputElement.value = 'a1b2c3d4';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(hostComponent.textControl.value).toBe('1234');
      });

      it('should remove hyphens when allowNegative is false (default)', () => {
        inputElement.value = '-123';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(hostComponent.textControl.value).toBe('123');
      });

      it('should allow a leading hyphen when allowNegative is true', () => {
        textInputInstance.allowNegative = true;
        fixture.detectChanges();
        inputElement.value = '-123';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(hostComponent.textControl.value).toBe('-123');
      });

      it('should correct a misplaced hyphen when allowNegative is true', () => {
        textInputInstance.allowNegative = true;
        fixture.detectChanges();
        inputElement.value = '123-';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(hostComponent.textControl.value).toBe('-123');
        expect(inputElement.value).toBe('-123');
      });

      it('should truncate a long number string based on maxLength', () => {
        hostComponent.maxLength = 5;
        fixture.detectChanges();
        inputElement.value = '123456789';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(hostComponent.textControl.value).toBe('12345');
      });
    });

    describe('Masking', () => {
      const phoneMask: InputMask = {
        maskFn: (value: string) => {
          return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d)(\d{4})$/, '$1-$2');
        },
        allowedCharsRegex: /[\d-]/,
      };

      beforeEach(() => {
        hostComponent.mask = phoneMask;
        hostComponent.maxLength = 11;
        fixture.detectChanges();
      });

      it('should apply the mask to user input', fakeAsync(() => {
        inputElement.value = '99999999999';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();
        expect(inputElement.value).toBe('(99) 99999-9999');
      }));

      it('should filter out disallowed characters', fakeAsync(() => {
        inputElement.value = '11a9b8c7d6e5f4g3h2i1';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();
        expect(hostComponent.textControl.value).toBe('11987654321');
        expect(inputElement.value).toBe('(11) 98765-4321');
      }));

      it('should apply the mask when value is set via writeValue', () => {
        hostComponent.textControl.setValue('11987654321');
        fixture.detectChanges();
        expect(inputElement.value).toBe('(11) 98765-4321');
      });
    });

    describe('Character Counter', () => {
      it('should not display char counter by default', () => {
        const counterEl = textInputNativeElement.querySelector('.char-counter');
        expect(counterEl).toBeNull();
      });

      it('should display only the current length when maxLength is not provided', () => {
        hostComponent.showCharCounter = true;
        hostComponent.maxLength = undefined;
        fixture.detectChanges();

        inputElement.value = 'test';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const counterEl = textInputNativeElement.querySelector('.char-counter');
        expect(counterEl).not.toBeNull();
        expect(counterEl?.textContent?.trim()).toBe('4');
      });

      it('should display char counter when showCharCounter is true', () => {
        hostComponent.showCharCounter = true;
        hostComponent.maxLength = 50;
        fixture.detectChanges();

        const counterEl = textInputNativeElement.querySelector('.char-counter');
        expect(counterEl).not.toBeNull();
        expect(counterEl?.textContent).toContain('0/50');
      });

      it('should update char counter on input', () => {
        hostComponent.showCharCounter = true;
        hostComponent.maxLength = 20;
        fixture.detectChanges();

        inputElement.value = 'hello';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const counterEl = textInputNativeElement.querySelector('.char-counter');
        expect(counterEl?.textContent).toContain('5/20');
      });
    });
  });
});
