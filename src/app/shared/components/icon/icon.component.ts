import { Component, Input } from '@angular/core';
import { IconConfig, IconName, IconSize } from './icon.types';
import { ICONS } from './icon.config';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  styleUrl: './icon.component.scss',
  template: `
    <i
      [class]="iconClass"
      [class.icon-sm]="size === 'sm'"
      [class.icon-md]="size === 'md'"
      [class.icon-lg]="size === 'lg'"
    ></i>
  `,
})
export class IconComponent {
  /** The name of the icon to display. Must be a valid IconName. */
  @Input({ required: true }) name!: IconName;

  /** The size of the icon. Defaults to 'md'. */
  @Input() size: IconSize = 'md';

  /** Retrieves the configuration object for the current icon name. */
  get iconConfig(): IconConfig {
    return ICONS[this.name];
  }

  /** Gets the specific CSS class for the icon based on its configuration. */
  get iconClass(): string {
    return this.iconConfig.icon;
  }
}
