import { ComponentFixture, TestBed } from "@angular/core/testing";
import { T } from "@fullcalendar/core/internal-common";
import { DropdownComponent, DropdownOption } from "./dropdown.component";
import { NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { forwardRef } from "@angular/core";

describe("DropDown Component", () => {
    let component: DropdownComponent<T>;
    let fixture: ComponentFixture<DropdownComponent<T>>;

    const mockOptions: DropdownOption<string>[] = [
        { label: 'Maçã', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Uva', value: 'grape' },
        { label: 'Laranja', value: 'orange' },
        { label: 'Morango', value: 'strawberry' },
        { label: 'Abacaxi', value: 'pineapple' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DropdownComponent],
            // providers: [
            //     {
            //         provide: NG_VALUE_ACCESSOR,
            //         useExisting: forwardRef(() => DropdownComponent),
            //         multi: true,
            //     }
            // ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DropdownComponent<T>);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render placeholder text', () => {
        component.options = mockOptions as any;
        component.multiSelect = false;
        component.placeholder = 'Select an option';
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.placeholder').textContent).toContain('Select an option')
    })

    it('should render default select options when isOpen is true', () => {
        component.options = mockOptions as any;
        component.multiSelect = false;
        fixture.detectChanges();

        expect(component.options.length).toBe(mockOptions.length)
        const select = fixture.nativeElement.querySelector('.dropdown-container');
        expect(select).toBeTruthy();

        component.toggleDropdown();
        fixture.detectChanges();

        const optionsEls = fixture.nativeElement.querySelectorAll('[role="option"]');
        expect(optionsEls[0].textContent).toContain('Maçã');
        expect(optionsEls.length).toBe(mockOptions.length);
        expect(component.filteredOptions.length).toBe(mockOptions.length);
    })

    it('should return value from select when option is selected', () => {
        component.options = mockOptions as any;
        component.multiSelect = false;
        fixture.detectChanges();

        expect(component.options.length).toBe(mockOptions.length)
        const select = fixture.nativeElement.querySelector('.dropdown-container');
        expect(select).toBeTruthy();

        component.toggleDropdown();
        fixture.detectChanges();

        const optionsEls = fixture.nativeElement.querySelectorAll('[role="option"]');
        optionsEls[0].click();
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(1);
        expect(component.selectedOptions[0].value).toBe('apple' as any);
    })

    it('should clear selected options when clear button is clicked', () => {
        component.options = mockOptions as any;
        component.multiSelect = false;
        fixture.detectChanges();

        component.toggleDropdown();
        fixture.detectChanges();

        const optionsEls = fixture.nativeElement.querySelectorAll('[role="option"]');
        optionsEls[0].click();
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(1);

        const event = new MouseEvent('click')
        component.clearSelection(event);
        expect(component.selectedOptions.length).toBe(0);
    })

    it('should select multiple options in multi-select mode', () => {
        component.options = mockOptions as any;
        component.multiSelect = true;
        fixture.detectChanges();

        component.toggleDropdown();
        fixture.detectChanges();

        const optionsEls = fixture.nativeElement.querySelectorAll('[role="option"]');
        optionsEls[0].click();
        optionsEls[1].click();
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(2);
        expect(component.selectedOptions.map(o => o.value)).toEqual(['apple', 'banana'] as any);
    });

    it('should filter options when searching', () => {
        component.searchable = true;
        component.options = mockOptions as any;
        component.multiSelect = true;
        fixture.detectChanges();

        component.toggleDropdown();
        fixture.detectChanges();

        component.searchText = 'maçã';
        component.filterOptions();
        fixture.detectChanges();

        expect(component.filteredOptions.length).toBe(1);
        expect(component.filteredOptions[0].label).toBe('Maçã');
    });

    it('should not show dropdown when is disabled', () => {
        component.searchable = true;
        component.options = mockOptions as any;
        component.multiSelect = true;
        component.isDisabled = true;
        fixture.detectChanges();

        component.toggleDropdown();
        fixture.detectChanges();

        expect(component.isOpen).toBe(false)
    });

    it('should write value for dropdown', () => {
        component.options = mockOptions as any;
        component.multiSelect = false;

        component.writeValue('apple' as any);
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(1);
        expect(component.selectedOptions[0].value).toBe('apple' as any);

    })

    it('should write value for multiple items on dropdown', () => {
        component.options = mockOptions as any;
        component.multiSelect = true;

        component.writeValue(['apple', 'banana' as any]);
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(2);
    })

    it('should write value as null', () => {
        component.options = mockOptions as any;
        component.multiSelect = true;

        component.writeValue(null);
        fixture.detectChanges();

        expect(component.selectedOptions.length).toBe(0);
    })

    it('should call registerOnChange function when value changes', () => {
        const mockFn = jasmine.createSpy('onChange');
        component.registerOnChange(mockFn);

        component.multiSelect = false;
        component.selectOption(mockOptions[0] as any);
        fixture.detectChanges();

        expect(mockFn).toHaveBeenCalledWith('apple');
    })

    it('should call setDisabledState function when value changes', () => {
        component.options = mockOptions as any;
        component.setDisabledState?.(true);
        fixture.detectChanges();

        expect(component.isDisabled).toBe(true);
    })

    it('should call registerOnTouched function when value changes', () => {
        const mockFn = jasmine.createSpy('onTouched ');
        component.options = mockOptions as any;
        fixture.detectChanges();

        component.registerOnTouched(mockFn);
        (component as any).closeDropdown();
        fixture.detectChanges();

        expect(mockFn).toHaveBeenCalledWith();
    })

    it('should return error on getError from ngControl', () => {
        const mockNgControl = {
            errors: { required: true },
            touched: true,
            invalid: true,
            dirty: true
        }
        component.ngControl = mockNgControl as any;
        fixture.detectChanges();

        expect(component.hasError).toBe(true)
    })

    it('should return message error from ngControl', () => {
        const mockNgControl = {
            errors: { required: true },
            touched: true,
            invalid: true,
            dirty: true
        }
        component.ngControl = mockNgControl as any;
        fixture.detectChanges();

        expect(component.errorMessage).toBeNull()
    })

    it('should return null error from ngControl', () => {
        const mockNgControl = {}
        component.ngControl = mockNgControl as any;
        fixture.detectChanges();

        expect(component.errorMessage).toBeNull()
    })

})