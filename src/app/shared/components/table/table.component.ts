import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BadgeComponent } from '../badge/badge.component';
import {
  DropdownComponent,
  DropdownOption,
} from '../dropdown/dropdown.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IconName } from '../icon/icon.types';
import { IconComponent } from '../icon/icon.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  type?: 'text' | 'profile' | 'badge' | 'actions' | 'custom';
  width?: string;
  profileConfig?: {
    imageKey: string;
    nameKey: string;
    subtitleKey: string;
    size?: 'sm' | 'md' | 'lg';
  };
  badgeConfig?: {
    typeKey: string;
    valueKey: string;
  };
}

export interface TableAction {
  icon: IconName;
  label?: string;
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  condition?: (item: any) => boolean;
  action: (item: any) => void;
}

export interface TableConfig {
  showCheckboxes?: boolean;
  showColumnSelector?: boolean;
  showPagination?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  responsive?: boolean;
  striped?: boolean;
  hover?: boolean;
  pageSizes?: number[];
  defaultPageSize?: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    IconButtonComponent,
    DropdownComponent,
    IconComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() config: TableConfig = {
    showCheckboxes: true,
    showColumnSelector: true,
    showPagination: true,
    sortable: true,
    selectable: true,
    responsive: true,
    hover: true,
    pageSizes: [10, 20, 50, 100],
    defaultPageSize: 10,
  };
  @Input() totalItems: number = 0;
  @Output() selectedRowsChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<{
    column: string;
    direction: 'asc' | 'desc' | 'default';
  }>();
  @Output() pageChange = new EventEmitter<{
    page: number;
    itemsPerPage: number;
  }>();

  visibleColumnsControl = new FormControl<string[]>([]);

  page = 1;
  itemsPerPage = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | 'default' = 'default';
  selectedRows = new Set<any>();

  private columnsMap: Map<string, boolean> = new Map();

  ngOnInit(): void {
    this.initializeColumns();
    this.initializePagination();
    this.setupColumnControl();
  }

  private initializeColumns(): void {
    this.columns.forEach((column) => {
      this.columnsMap.set(column.key, column.visible !== false);
    });

    const visibleColumns = this.columns
      .filter((col) => col.visible !== false)
      .map((col) => col.key);

    this.visibleColumnsControl.setValue(visibleColumns);
  }

  private initializePagination(): void {
    this.itemsPerPage = this.config.defaultPageSize || 10;
  }

  private setupColumnControl(): void {
    this.visibleColumnsControl.valueChanges.subscribe(
      (selected: string[] | null) => {
        if (!selected || selected.length < 1) {
          const visibleColumns = Array.from(this.columnsMap.entries())
            .filter(([_, visible]) => visible)
            .map(([key, _]) => key);

          this.visibleColumnsControl.setValue(visibleColumns, {
            emitEvent: false,
          });
          return;
        }

        this.columnsMap.forEach((_, key) => {
          this.columnsMap.set(key, selected.includes(key));
        });
      }
    );
  }

  get columnOptions(): DropdownOption<string>[] {
    return this.columns.map((column) => ({
      label: column.label,
      value: column.key,
      disabled: this.isColumnDisabled(column.key),
    }));
  }

  private isColumnDisabled(columnKey: string): boolean {
    const visibleCount = Array.from(this.columnsMap.values()).filter(
      Boolean
    ).length;
    return visibleCount <= 1 && this.columnsMap.get(columnKey) === true;
  }

  isColumnVisible(columnKey: string): boolean {
    return this.columnsMap.get(columnKey) === true;
  }

  get visibleColumns(): TableColumn[] {
    return this.columns.filter((column) => this.isColumnVisible(column.key));
  }

  get hasActionsColumn(): boolean {
    return this.actions.length > 0;
  }

  toggleSelection(item: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRows.add(item);
    } else {
      this.selectedRows.delete(item);
    }
    this.emitSelectedRows();
  }

  selectAllVisible(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.paginatedData.forEach((item) => this.selectedRows.add(item));
    } else {
      this.paginatedData.forEach((item) => this.selectedRows.delete(item));
    }
    this.emitSelectedRows();
  }

  private emitSelectedRows(): void {
    this.selectedRowsChange.emit(Array.from(this.selectedRows));
  }

  setSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      if (this.sortDirection === 'default') {
        this.sortDirection = 'asc';
      } else if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = 'default';
        this.sortColumn = '';
      }
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({
      column: this.sortColumn,
      direction: this.sortDirection,
    });
  }

  get paginatedData(): any[] {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    let sorted = [...this.data];
    if (this.sortColumn && this.config.sortable) {
      sorted.sort((a, b) => {
        const aValue = this.getNestedValue(a, this.sortColumn);
        const bValue = this.getNestedValue(b, this.sortColumn);

        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  isSelected(item: any): boolean {
    return this.selectedRows.has(item);
  }

  onPageChangeInternal(newPage: number): void {
    this.page = newPage;
    this.pageChange.emit({
      page: this.page,
      itemsPerPage: this.itemsPerPage,
    });
  }

  onItemsPerPageChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.page = 1;
    this.pageChange.emit({
      page: this.page,
      itemsPerPage: this.itemsPerPage,
    });
  }

  getCellValue(item: any, column: TableColumn): any {
    return this.getNestedValue(item, column.key);
  }

  shouldShowAction(action: TableAction, item: any): boolean {
    return !action.condition || action.condition(item);
  }

  executeAction(action: TableAction, item: any): void {
    action.action(item);
  }

  getSortClass(column: TableColumn): string {
    if (!column.sortable || this.sortColumn !== column.key) {
      return '';
    }
    return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  get allVisibleSelected(): boolean {
    if (this.paginatedData.length === 0) return false;
    return this.paginatedData.every((item) => this.isSelected(item));
  }

  get someVisibleSelected(): boolean {
    return (
      this.paginatedData.some((item) => this.isSelected(item)) &&
      !this.allVisibleSelected
    );
  }

  get selectedData() {
    return this.selectedRows;
  }
}
