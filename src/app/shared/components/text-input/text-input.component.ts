import {
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IconName } from '../icon/icon.types';
import { Subject, takeUntil } from 'rxjs';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
type IconPosition = 'prefix' | 'suffix';
export interface InputMask {
  maskFn: (value: string) => string;
  allowedCharsRegex: RegExp;
}

@Component({
  selector: 'app-text-input',
  standalone: true,
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  imports: [IconComponent, IconButtonComponent],
})
export class TextInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) readonly: boolean = false;
  @Input({ transform: booleanAttribute }) allowNegative: boolean = false;
  @Input() placeholder: string = '';
  @Input() label?: string = '';
  @Input() icon?: IconName;
  @Input() iconPosition: IconPosition = 'prefix';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() mask?: InputMask;
  @Input() helperText?: string;
  @Input() maxLength?: number;
  @Input({ transform: booleanAttribute }) showCharCounter: boolean = false;
  @Output() suffixIconClick = new EventEmitter<MouseEvent>();
  @Output() blur = new EventEmitter<void>();

  public currentInputType: InputType = 'text';
  private _originalType: InputType = 'text';
  public errorMessage: string | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('input') public nativeInputRef!: ElementRef<HTMLInputElement>;

  @Input()
  set type(value: InputType) {
    this._originalType = value;
    this.currentInputType = value;
  }
  get type(): InputType {
    return this._originalType;
  }

  isFocused: boolean = false;

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.ngControl.control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.updateErrorState());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string): void {
    const rawValue = value || '';
    if (this.mask) {
      this.value = this.mask.maskFn(rawValue);
    } else {
      this.value = rawValue;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (
      input.selectionStart === null &&
      this._originalType !== 'email' &&
      !this.mask
    ) {
      return;
    }

    const currentValue = input.value;
    let modelValue = currentValue;
    let viewValue = currentValue;

    if (this.mask) {
      const regex = this.mask.allowedCharsRegex;
      const invertedRegex = new RegExp(`[^${regex.source.slice(1, -1)}]`, 'g');
      modelValue = currentValue.replace(invertedRegex, '');

      if (this.maxLength && modelValue.length > this.maxLength) {
        modelValue = modelValue.slice(0, this.maxLength);
      }

      viewValue = this.mask.maskFn(modelValue);

      const currentCursorPos = input.selectionStart;
      if (currentCursorPos !== null) {
        const allowedCharsRegex = this.mask.allowedCharsRegex;
        let rawCharsBeforeCursor = 0;
        for (let i = 0; i < currentCursorPos; i++) {
          if (allowedCharsRegex.test(currentValue[i])) {
            rawCharsBeforeCursor++;
          }
        }
        let newCursorPos = 0;
        let rawCharsCount = 0;
        for (const char of viewValue) {
          if (rawCharsCount >= rawCharsBeforeCursor) break;
          if (allowedCharsRegex.test(char)) {
            rawCharsCount++;
          }
          newCursorPos++;
        }
        requestAnimationFrame(() => {
          input.value = viewValue;
          input.setSelectionRange(newCursorPos, newCursorPos);
        });
      } else {
        requestAnimationFrame(() => {
          input.value = viewValue;
        });
      }
    } else if (this._originalType === 'number') {
      let sanitizedValue = currentValue.replace(/[^0-9-]/g, '');
      if (!this.allowNegative) {
        sanitizedValue = sanitizedValue.replace(/-/g, '');
      } else if (sanitizedValue.lastIndexOf('-') > 0) {
        sanitizedValue = '-' + sanitizedValue.replace(/-/g, '');
      }

      if (this.maxLength && sanitizedValue.length > this.maxLength) {
        sanitizedValue = sanitizedValue.slice(0, this.maxLength);
      }

      modelValue = sanitizedValue;
      viewValue = sanitizedValue;
    } else {
      if (this.maxLength && modelValue.length > this.maxLength) {
        modelValue = modelValue.slice(0, this.maxLength);
        viewValue = modelValue;
      }
    }

    if (!this.mask && input.value !== viewValue) {
      input.value = viewValue;
    }

    this.value = viewValue;
    this.onChange(modelValue);
    this.valueChange.emit(viewValue);
  }

  onInputFocus(): void {
    this.isFocused = true;
  }

  onInputBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.updateErrorState();
    this.blur.emit();
  }
  onSuffixClick(event: MouseEvent): void {
    this.suffixIconClick.emit(event);
  }

  togglePasswordVisibility(): void {
    this.currentInputType =
      this.currentInputType === 'password' ? 'text' : 'password';
  }

  private updateErrorState(): void {
    this.errorMessage = null;

    if (!this.ngControl?.control || !this.ngControl.touched) {
      return;
    }

    const errors = this.ngControl.control.errors;
    if (errors) {
      for (const errorKey of Object.keys(this.errorMessages)) {
        if (errors[errorKey]) {
          this.errorMessage = this.errorMessages[errorKey];
          return;
        }
      }

      const firstUnhandledErrorKey = Object.keys(errors)[0];
      if (firstUnhandledErrorKey) {
        this.errorMessage = `Erro no campo: ${firstUnhandledErrorKey}`;
      }
    }
  }

  get inputMode():
    | 'numeric'
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'none'
    | 'search'
    | 'decimal' {
    switch (this._originalType) {
      case 'number':
      case 'tel':
        return 'numeric';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      default:
        return this.mask ? 'numeric' : 'text';
    }
  }

  get charCounterText(): string {
    const length = this.value?.length || 0;
    if (this.maxLength) {
      return `${length}/${this.maxLength}`;
    }
    return length.toString();
  }

  @HostBinding('class.has-error')
  get hasError(): boolean {
    return !!this.errorMessage;
  }

  @HostBinding('class.is-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  @HostBinding('class.focused')
  get isCurrentlyFocused(): boolean {
    return this.isFocused;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return !!this.value;
  }

  @HostBinding('class.has-prefix-icon')
  get hasPrefixIcon(): boolean {
    return !!this.prefixIconName;
  }

  get showPasswordToggleButton(): boolean {
    return this._originalType === 'password';
  }

  @HostBinding('class.has-suffix-content')
  get hasSuffixContent(): boolean {
    return !!this.suffixIconName || this.showPasswordToggleButton;
  }

  get prefixIconName(): IconName | undefined {
    return this.icon && this.iconPosition === 'prefix' ? this.icon : undefined;
  }

  get suffixIconName(): IconName | undefined {
    return this.icon && this.iconPosition === 'suffix' ? this.icon : undefined;
  }

  get passwordToggleIcon(): IconName {
    return this.currentInputType === 'password' ? 'eyeOff' : 'eye';
  }

  get inputType(): InputType {
    if (this._originalType === 'password') {
      return this.currentInputType;
    }

    if (this._originalType === 'number' || this.mask) {
      return 'text';
    }

    return this.currentInputType;
  }
}
