import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  Injector,
  OnInit,
  Optional,
  Self,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { IconComponent } from '../icon/icon.component';

export interface DropdownOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxComponent, IconComponent],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent<T>
  implements ControlValueAccessor, AfterViewInit, OnInit
{
  // Propriedade privada para armazenar o estado real
  private _isDisabled = false;

  // --- Component Inputs ---

  /** The label to be displayed above the dropdown. */
  @Input() label?: string;

  /** A map of error keys to error messages. */
  @Input() errorMessages: { [key: string]: string } = {};

  /** The complete list of dropdown options. */
  @Input() options: DropdownOption<T>[] = [];

  /** The placeholder text to display when no option is selected. */
  @Input() placeholder: string = 'Selecione uma opção';

  /** Whether multiple options can be selected. */
  @Input({ transform: booleanAttribute }) multiSelect: boolean = false;

  /** Whether the clear button is shown when a value is selected. */
  @Input({ transform: booleanAttribute }) clearable: boolean = false;

  /** Determines if the search input is visible inside the dropdown menu. Defaults to true. */
  @Input({ transform: booleanAttribute }) searchable: boolean = false;

  /** An optional template for rendering each item in the options list. */
  @Input() optionTpl?: TemplateRef<any>;

  /** An optional template for rendering the selected value(s) in the display area. */
  @Input() selectedTpl?: TemplateRef<any>;

  // --- View Children ---

  /** A reference to the search input element within the template. */
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // --- Public Properties ---

  /** The list of options currently visible to the user (can be filtered by search). */
  public filteredOptions: DropdownOption<T>[] = [];

  /** The currently selected option or options. */
  public selectedOptions: DropdownOption<T>[] = [];

  /** The current visibility state of the dropdown menu. */
  public isOpen = false;

  /** The current text value of the search input. */
  public searchText = '';

  /** The current focus state of the component. */
  public isFocused = false;

  /** @internal */
  public ngControl: NgControl | null = null;

  // --- ControlValueAccessor Methods ---

  /** @internal */
  private onChange: (value: T | T[] | null) => void = () => {};
  /** @internal */
  private onTouched: () => void = () => {};

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Lifecycle hook that initializes the filtered options list. */
  ngAfterViewInit(): void {
    this.filteredOptions = [...this.options];
  }

  /** The disabled state of the component. Can be set via template binding or Angular Forms. */
  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  @Input({ transform: booleanAttribute })
  set isDisabled(value: boolean) {
    this._isDisabled = value;
    this.cdr.markForCheck();
  }

  public get hasError(): boolean {
    return !!(
      this.ngControl?.invalid &&
      (this.ngControl?.touched || this.ngControl?.dirty)
    );
  }

  public get errorMessage(): string | null {
    if (!this.hasError || !this.ngControl?.errors) {
      return null;
    }
    const errorKey = Object.keys(this.ngControl.errors)[0];
    return this.errorMessages[errorKey] || null;
  }

  /** Listens for clicks on the document to close the dropdown when clicking outside of it. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen) {
      this.closeDropdown();
    }
  }

  /**
   * Writes a new value to the element.
   * This method is called by the Forms module to set the value.
   */
  writeValue(value: T | T[] | null): void {
    if (this.multiSelect && Array.isArray(value)) {
      this.selectedOptions = this.options.filter((option) =>
        value.includes(option.value)
      );
    } else if (!this.multiSelect && value !== null && !Array.isArray(value)) {
      const selected = this.options.find((option) => option.value === value);
      this.selectedOptions = selected ? [selected] : [];
    } else {
      this.selectedOptions = [];
    }
    this.cdr.markForCheck();
  }

  /** Registers a callback function that is called when the control's value changes in the UI. */
  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  /** Registers a callback function that is called by the forms API on component touch. */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** This function is called by the forms API when the control status changes to or from 'DISABLED'. */
  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  /** Toggles the visibility of the dropdown menu. */
  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.isFocused = true;
        this.searchText = '';
        this.filterOptions();

        // Focus the search input when opening
        if (this.searchable) {
          setTimeout(() => this.searchInput.nativeElement.focus(), 0);
        }
      } else {
        this.closeDropdown();
      }
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.isFocused = false;
    this.onTouched();
    this.cdr.markForCheck();
  }

  /** Handles the logic of selecting an option. */
  selectOption(option: DropdownOption<T>): void {
    if (this.multiSelect) {
      // Toggle selection for multi-select
      const index = this.selectedOptions.findIndex(
        (o) => o.value === option.value
      );
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
      this.onChange(this.selectedOptions.map((o) => o.value));
    } else {
      // Set single selection and close dropdown
      this.selectedOptions = [option];
      this.onChange(option.value);
      this.closeDropdown();
    }
  }

  /** Checks if a given option is currently selected. */
  isSelected(option: DropdownOption<T>): boolean {
    return this.selectedOptions.some((o) => o.value === option.value);
  }

  /** Filters the options based on the current search text. */
  filterOptions(): void {
    if (!this.searchText) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option.label.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  /** Gets the text to be displayed in the dropdown's main area. */
  get displayValue(): string {
    if (this.multiSelect) {
      if (this.selectedOptions.length === 0) return this.placeholder;
      if (this.selectedOptions.length === 1)
        return this.selectedOptions[0].label;
      return `${this.selectedOptions.length} opções selecionadas`;
    }
    return this.selectedOptions[0]?.label || this.placeholder;
  }

  /** Clears the current selection. */
  clearSelection(event: MouseEvent): void {
    event.stopPropagation(); // Prevents the dropdown from opening
    this.selectedOptions = [];
    this.onChange(this.multiSelect ? [] : null);
    this.onTouched();
  }
}
