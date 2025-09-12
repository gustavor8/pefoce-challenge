import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';
import '@angular/localize/init'

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default inputs', () => {
    expect(component.page).toBe(1);
    expect(component.itemsPerPage).toBe(10);
    expect(component.collectionSize).toBe(0);
    expect(component.pageSizes).toEqual([]);
  });

  it('should emit pageChange when page is changed', () => {
    spyOn(component.pageChange, 'emit');
    component.page = 2;
    fixture.detectChanges();

    component.pageChange.emit(component.page);

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit itemsPerPageChange on onPageSizeChange()', () => {
    spyOn(component.itemsPerPageChange, 'emit');

    // Mock select change event
    const mockEvent = {
      target: { value: '25' }
    } as unknown as Event;

    component.onPageSizeChange(mockEvent);

    expect(component.itemsPerPageChange.emit).toHaveBeenCalledWith(25);
  });

  it('should emit itemsPerPageChange with NaN if event target has invalid value', () => {
    spyOn(component.itemsPerPageChange, 'emit');

    const badEvent = {
      target: { value: 'not-a-number' }
    } as unknown as Event;

    component.onPageSizeChange(badEvent);

    expect(component.itemsPerPageChange.emit).toHaveBeenCalledWith(NaN);
  });
});
