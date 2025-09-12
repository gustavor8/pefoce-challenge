import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() label: string = 'Label';
  @Input() additionalClasses: string = '';
  @Input() type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Output() onClick = new EventEmitter<MouseEvent>();

  handleClick(): void {
    this.onClick.emit();
  }
}
