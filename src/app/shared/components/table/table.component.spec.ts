import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAction, TableColumn, TableComponent } from './table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';
import { BadgeComponent } from '../badge/badge.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { IconComponent } from '../icon/icon.component';
import '@angular/localize/init';
import { ex } from '@fullcalendar/core/internal-common';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      profile: { image: 'john.jpg', name: 'John Doe', subtitle: 'Developer' },
      badge: { type: 'success', value: 'Active' }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'inactive',
      profile: { image: 'jane.jpg', name: 'Jane Smith', subtitle: 'Designer' },
      badge: { type: 'warning', value: 'Pending' }
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'active',
      profile: { image: 'bob.jpg', name: 'Bob Johnson', subtitle: 'Manager' },
      badge: { type: 'success', value: 'Active' }
    }
  ];

  const mockColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, visible: true },
    { key: 'name', label: 'Name', sortable: true, visible: true },
    { key: 'email', label: 'Email', sortable: true, visible: true },
    {
      key: 'profile',
      label: 'Profile',
      type: 'profile',
      profileConfig: {
        imageKey: 'profile.image',
        nameKey: 'profile.name',
        subtitleKey: 'profile.subtitle',
        size: 'md'
      }
    },
    {
      key: 'badge',
      label: 'Status',
      type: 'badge',
      badgeConfig: {
        typeKey: 'badge.type',
        valueKey: 'badge.value'
      }
    }
  ];

  const mockActions: TableAction[] = [
    {
      icon: 'edit',
      label: 'Edit',
      variant: 'primary',
      action: jasmine.createSpy('editAction')
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'outline',
      condition: (item) => item.status === 'active',
      action: jasmine.createSpy('deleteAction')
    }
  ];

  const mockConfig = {
    showCheckboxes: true,
    showColumnSelector: true,
    showPagination: true,
    sortable: true,
    selectable: true,
    responsive: true,
    hover: true,
    pageSizes: [10, 20, 50],
    defaultPageSize: 10
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, ReactiveFormsModule, ProfileComponent, BadgeComponent, PaginationComponent, IconButtonComponent, DropdownComponent, IconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    expect(component.data).toEqual([]);
    expect(component.columns).toEqual([]);
    expect(component.actions).toEqual([]);
    expect(component.config).toEqual({
      showCheckboxes: true,
      showColumnSelector: true,
      showPagination: true,
      sortable: true,
      selectable: true,
      responsive: true,
      hover: true,
      pageSizes: [10, 20, 50, 100],
      defaultPageSize: 10
    })
  });

  it('should initialize default data correctly', () => {
    component.data = mockData;
    component.columns = mockColumns;
    component.actions = mockActions;
    component.config = mockConfig;
    fixture.detectChanges();

    expect(component.data).toEqual(mockData);
    expect(component.columns).toEqual(mockColumns);
    expect(component.actions).toEqual(mockActions);
    expect(component.config).toEqual(mockConfig);
  })

  it('should initialize pagination correctly', () => {
    component.config = mockConfig;
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(component.itemsPerPage).toBe(10);
  })

  it('should initialize columns map correctly', () => {
    component.columns = mockColumns;
    component.config = mockConfig;
    component.data = mockData;
    component.ngOnInit();
    fixture.detectChanges();

    mockColumns.forEach(column => {
      expect(component.isColumnVisible(column.key)).toBe(true);
    });
  });

  describe('Column Management', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.config = mockConfig;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct column options', () => {
      const options = component.columnOptions as any;
      expect(options.length).toBe(mockColumns.length);
      expect(options[0]).toEqual({ label: 'ID', value: 'id', disabled: false });
    })

    it('should filter visible columns correctly', () => {
      const visibleColumns = component.visibleColumns;
      expect(visibleColumns.length).toBe(mockColumns.length);
      expect(visibleColumns).toEqual(mockColumns);
    });

    it('should hide column when deselected', () => {
      component.visibleColumnsControl.setValue(['id', 'name']);

      expect(component.isColumnVisible('id')).toBe(true);
      expect(component.isColumnVisible('name')).toBe(true);
      expect(component.isColumnVisible('email')).toBe(false);
    });
  })

  describe('Data Management', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.config = mockConfig;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return paginated data correctly', () => {
      component.itemsPerPage = 2;

      const paginatedData = component.paginatedData;

      expect(paginatedData.length).toBe(2);
      expect(paginatedData[0].id).toBe(1);
      expect(paginatedData[1].id).toBe(2);
    });

    it('should return paginated data correctly', () => {
      component.itemsPerPage = 2;

      const paginatedData = component.paginatedData;

      expect(paginatedData.length).toBe(2);
      expect(paginatedData[0].id).toBe(1);
      expect(paginatedData[1].id).toBe(2);
    });
  })

  describe('Sorting Management', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.config = mockConfig;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should sort data arcendingly', () => {
      const column = mockColumns[1];
      component.setSort(column);
      fixture.detectChanges();

      expect(component.sortColumn).toBe('name');
      expect(component.sortDirection).toBe('asc');

      const paginatedData = component.paginatedData;
      expect(paginatedData[0].id).toBe(3);
    })
    it('should reset sort on third click', () => {
      const column = mockColumns[1];

      component.setSort(column);
      component.setSort(column);
      component.setSort(column);

      expect(component.sortDirection).toBe('default');
      expect(component.sortColumn).toBe('');
    });

    it('should not sort non-sortable columns', () => {
      const nonSortableColumn = { key: 'test', label: 'Test', sortable: false };

      component.setSort(nonSortableColumn);

      expect(component.sortColumn).toBe('');
      expect(component.sortDirection).toBe('default');
    });

    it('should emit sort change event', () => {
      spyOn(component.sortChange, 'emit');
      const column = mockColumns[0];

      component.setSort(column);

      expect(component.sortChange.emit).toHaveBeenCalledWith({
        column: 'id',
        direction: 'asc'
      });
    });

    it('should return correct sort class', () => {
      const column = mockColumns[0];
      component.sortColumn = 'id';
      component.sortDirection = 'asc';

      expect(component.getSortClass(column)).toBe('sort-asc');

      component.sortDirection = 'desc';
      expect(component.getSortClass(column)).toBe('sort-desc');
    });
  });

  describe('Selection Management', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.config = mockConfig;
      fixture.detectChanges();
    });

    it('should toggle single item selection', () => {
      spyOn(component.selectedRowsChange, 'emit');
      const mockEvent = { target: { checked: true } } as any;

      component.toggleSelection(mockData[0], mockEvent);

      expect(component.isSelected(mockData[0])).toBe(true);
      expect(component.selectedRowsChange.emit).toHaveBeenCalledWith([mockData[0]]);
    });

    it('should deselect item when checkbox is unchecked', () => {
      component.selectedRows.add(mockData[0]);
      const mockEvent = { target: { checked: false } } as any;

      component.toggleSelection(mockData[0], mockEvent);

      expect(component.isSelected(mockData[0])).toBe(false);
    });

    it('should select all visible items', () => {
      const mockEvent = { target: { checked: true } } as any;

      component.selectAllVisible(mockEvent);

      expect(component.selectedRows.size).toBe(mockData.length);
    });

    it('should deselect all visible items', () => {
      mockData.forEach(item => component.selectedRows.add(item));
      const mockEvent = { target: { checked: false } } as any;

      component.selectAllVisible(mockEvent);

      expect(component.selectedRows.size).toBe(0);
    });

    it('should determine if all visible items are selected', () => {
      mockData.forEach(item => component.selectedRows.add(item));

      expect(component.allVisibleSelected).toBe(true);
    });

    it('should determine if some visible items are selected', () => {
      component.selectedRows.add(mockData[0]);

      expect(component.someVisibleSelected).toBe(true);
      expect(component.allVisibleSelected).toBe(false);
    });

    it('should return empty Set when no items are selected', () => {
      const selectedData = component.selectedData;

      expect(selectedData).toBeInstanceOf(Set);
      expect(selectedData.size).toBe(0);
    });

    it('should return Set with selected items', () => {
      // Select some items
      component.selectedRows.add(mockData[0]);
      component.selectedRows.add(mockData[2]);

      const selectedData = component.selectedData;

      expect(selectedData).toBeInstanceOf(Set);
      expect(selectedData.size).toBe(2);
      expect(selectedData.has(mockData[0])).toBe(true);
      expect(selectedData.has(mockData[2])).toBe(true);
      expect(selectedData.has(mockData[1])).toBe(false);
    });

    it('should return the same Set reference as selectedRows', () => {
      component.selectedRows.add(mockData[0]);

      const selectedData = component.selectedData;

      expect(selectedData).toBe(component.selectedRows);
    });

    it('should log selected items to console', () => {
      spyOn(console, 'log');
      component.selectedRows.add(mockData[0]);
      component.selectedRows.add(mockData[1]);

      const selectedData = component.selectedData;

      expect(console.log).toHaveBeenCalledWith([mockData[0], mockData[1]]);
    });

    it('should log empty array when no items selected', () => {
      spyOn(console, 'log');

      const selectedData = component.selectedData;

      expect(console.log).toHaveBeenCalledWith([]);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.config = mockConfig;
      fixture.detectChanges();
    });

    it('should change page correctly', () => {
      spyOn(component.pageChange, 'emit');

      component.onPageChangeInternal(2);

      expect(component.page).toBe(2);
      expect(component.pageChange.emit).toHaveBeenCalledWith({
        page: 2,
        itemsPerPage: 10
      });
    });

    it('should change items per page and reset to first page', () => {
      spyOn(component.pageChange, 'emit');
      component.page = 3;

      component.onItemsPerPageChange(20);

      expect(component.itemsPerPage).toBe(20);
      expect(component.page).toBe(1);
      expect(component.pageChange.emit).toHaveBeenCalledWith({
        page: 1,
        itemsPerPage: 20
      });
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      component.data = mockData;
      component.columns = mockColumns;
      component.actions = mockActions;
      component.config = mockConfig;
      fixture.detectChanges();
    });

    it('should determine if actions column should be shown', () => {
      expect(component.hasActionsColumn).toBe(true);

      component.actions = [];
      expect(component.hasActionsColumn).toBe(false);
    });

    it('should show action based on condition', () => {
      const action = mockActions[1]; // delete action with condition

      expect(component.shouldShowAction(action, mockData[0])).toBe(true); // active
      expect(component.shouldShowAction(action, mockData[1])).toBe(false); // inactive
    });

    it('should show action without condition', () => {
      const action = mockActions[0]; // edit action without condition

      expect(component.shouldShowAction(action, mockData[0])).toBe(true);
      expect(component.shouldShowAction(action, mockData[1])).toBe(true);
    });

    it('should execute action correctly', () => {
      const action = mockActions[0];

      component.executeAction(action, mockData[0]);

      expect(action.action).toHaveBeenCalledWith(mockData[0]);
    });
  })
});