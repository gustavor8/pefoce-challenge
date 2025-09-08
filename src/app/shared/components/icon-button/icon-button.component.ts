import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonColor,
  ButtonComponent,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '../button/button.component';
import { IconName } from '../icon/icon.types';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  // --- Component Inputs ---

  /** The name of the icon to display. This is required. */
  @Input({ required: true }) icon!: IconName;

  @Input() customTitle?: string;

  /** The visual style of the button. */
  @Input() variant: ButtonVariant = 'primary';

  /** The color palette of the button. */
  @Input() color: ButtonColor = 'primary';

  /** The size of the button. */
  @Input() size: ButtonSize = 'md';

  /** Whether the button is disabled. */
  @Input() disabled = false;

  /** The native HTML button type. */
  @Input() type: ButtonType = 'button';

  /** Whether the button is in a loading state. */
  @Input() loading = false;

  // --- Component Outputs ---

  /** Emits an event when the button is clicked. */
  @Output() onClick = new EventEmitter<MouseEvent>();
}
