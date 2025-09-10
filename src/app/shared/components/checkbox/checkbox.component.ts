import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  OnDestroy,
  Optional,
  Self,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label!: string;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() indeterminate: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};

  @Output() checkChange = new EventEmitter<boolean>();

  private _checked: boolean = false;
  isFocused: boolean = false;
  errorMessage: string | null = null;
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

  @HostBinding('class.has-error')
  get hasError(): boolean {
    return !!this.errorMessage;
  }

  @HostBinding('attr.data-label-position')
  get labelPositionAttr(): 'before' | 'after' {
    return this.labelPosition;
  }

  @HostBinding('class.focused')
  get isCurrentlyFocused(): boolean {
    return this.isFocused;
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this.disabled ? -1 : 0;
  }

  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
    this.onChange(this._checked);
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.checked = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.indeterminate = false;
      this.checked = !this.checked;
      this.checkChange.emit(this.checked);
    }
  }

  @HostListener('keydown.space', ['$event'])
  onSpace(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.indeterminate = false;
      this.checked = !this.checked;
      this.checkChange.emit(this.checked);
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
  }

  @HostBinding('class.is-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.updateErrorState();
  }

  private updateErrorState(): void {
    this.errorMessage = null;
    if (this.ngControl?.control && this.ngControl.touched) {
      const errors = this.ngControl.control.errors;
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        this.errorMessage =
          this.errorMessages[firstErrorKey] ||
          `Erro de validação: ${firstErrorKey}`;
      }
    }
  }
}
