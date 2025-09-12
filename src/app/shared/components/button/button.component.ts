import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { LoaderComponent } from '../loader/loader.component';
import { IconName } from '../icon/icon.types';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'outline' | 'text' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
type IconPosition = 'left' | 'right';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'green'
  | 'red'
  | 'orange'
  | 'teal'
  | 'neutral'
  | 'gray';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [LoaderComponent, IconComponent, CommonModule],
})
export class ButtonComponent {
  // --- Component Inputs ---
  @Input() label = '';

  /** The visual style of the button. */
  @Input() variant: ButtonVariant = 'primary';

  /** The color palette of the button. */
  @Input() color: ButtonColor = 'primary';

  /** The size of the button. */
  @Input() size: ButtonSize = 'md';

  /** Whether the button is disabled. */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** The native HTML button type. */
  @Input() type: ButtonType = 'button';

  /** An optional icon to display inside the button. */
  @Input() icon?: IconName;

  /** An optional title for the icon, used for accessibility. */
  @Input() iconTitle?: string;

  /** Whether the button should occupy the full width of its container. */
  @Input({ transform: booleanAttribute }) fullWidth = false;

  /** Whether the button is in a loading state. */
  @Input({ transform: booleanAttribute }) loading = false;

  /** The position of the icon relative to the button's text. */
  @Input() iconPosition: IconPosition = 'right';

  // --- Component Outputs ---

  /** Emits an event when the button is clicked. */
  @Output() onClick = new EventEmitter<MouseEvent>();

  // --- Public Properties ---

  /**
   * Checks if the button is intended to be an icon-only button.
   * @returns {boolean} True if there's an icon but no label text.
   */
  get isIconOnly(): boolean {
    return !!this.icon && !this.label?.trim();
  }

  get classes() {
    return {
      // variant classes
      'button--primary': this.variant === 'primary',
      'button--outline': this.variant === 'outline',
      'button--text': this.variant === 'text',
      'button--icon': this.variant === 'icon',

      //colors
      [`button--color-${this.color}`]: true,

      // size classes
      'button--sm': this.size === 'sm',
      'button--md': this.size === 'md',
      'button--lg': this.size === 'lg',

      // state classes
      'button--loading': this.loading,
      'button--full-width': this.fullWidth,
      'button--icon-only': this.isIconOnly,
      'button--primary--disabled': this.disabled && this.variant === 'primary',
      'button--outline--disabled': this.disabled && this.variant === 'outline',
      'button--text--disabled': this.disabled && this.variant === 'text',
    };
  }

  /**
   * Handles the click event, emitting the onClick event if not disabled or loading.
   */
  handleClick(): void {
    if (!this.loading && !this.disabled) {
      this.onClick.emit();
    }
  }
}
