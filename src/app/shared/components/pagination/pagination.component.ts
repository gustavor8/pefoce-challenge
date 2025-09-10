import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, DropdownComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() itemsPerPage = 10;
  @Input() collectionSize = 0;
  @Input() pageSizes: number[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  onPageSizeChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.itemsPerPageChange.emit(value);
  }
}
