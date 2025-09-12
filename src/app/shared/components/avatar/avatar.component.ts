import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, IconComponent,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() icon?: string;
  @Input() alt: string = 'avatar image';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() additionalClasses: string = '';
}
