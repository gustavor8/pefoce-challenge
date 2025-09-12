import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-card.component.html',
  styleUrls: ['./tag-card.component.scss'],
})
export class TagCardComponent {
  @Input() iconClass: string = '';
  @Input() title: string = '';
  @Input() quantity: number = 0;
  @Input() bgColor?: string;

  @Output() clicked = new EventEmitter<string>();

  onClick(): void {
    alert('Implementar lógcia que levaria para as solicitações mencionadas!');
  }
}
