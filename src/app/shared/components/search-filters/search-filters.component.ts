import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { TabComponent } from '../tab/tab.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchField, searchTypes } from './search-filters.types';
import { TextInputComponent } from '../text-input/text-input.component';
import { ButtonComponent } from '../button/button.component';
@Component({
  selector: 'app-search-filters',
  imports: [
    TabsComponent,
    TabComponent,
    DropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    ButtonComponent,
  ],
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss',
})
export class SearchFiltersComponent {
  @Output() searchEvent = new EventEmitter<any>();
  activeFields: SearchField[] = [];
  isLoading: boolean = false;

  fb = inject(FormBuilder);
  searchForm: FormGroup;
  searchOptions = searchTypes.map((st) => ({
    value: st.value,
    label: st.label,
  }));

  constructor() {
    this.searchForm = this.fb.group({
      searchType: ['solicitacao', Validators.required],
    });
  }

  ngOnInit(): void {
    this.searchForm
      .get('searchType')
      ?.valueChanges.subscribe((selectedValue) => {
        this.updateDynamicFields(selectedValue);
      });

    this.updateDynamicFields(this.searchForm.get('searchType')?.value);
  }

  updateDynamicFields(typeValue: string) {
    const selectedType = searchTypes.find((st) => st.value === typeValue);

    this.clearDynamicControls();
    this.activeFields = [];

    if (!selectedType) return;

    this.activeFields = selectedType.fields;

    this.activeFields.forEach((field) => {
      const validators = field.required ? [Validators.required] : [];
      this.searchForm.addControl(field.name, this.fb.control('', validators));
    });
  }

  clearDynamicControls() {
    Object.keys(this.searchForm.controls).forEach((key) => {
      if (key !== 'searchType') {
        this.searchForm.removeControl(key);
      }
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.isLoading = true;
      alert('Lógica de busca não implementada!');

      this.searchEvent.emit(this.searchForm.value);
    } else {
      this.searchForm.markAllAsTouched();
    }
    this.isLoading = false;
  }
}
