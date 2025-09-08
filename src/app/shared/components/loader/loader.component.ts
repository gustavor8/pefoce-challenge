import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';

export type LoaderVariant = 'default' | 'neutral';
export type LoaderSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  /** The color variant of the Loaderner. Defaults to 'default'. */
  @Input({
    transform: (value: LoaderVariant) => `variant-${value}`,
  })
  variant: string = 'variant-default';

  /** The size of the Loaderner. Defaults to 'md'. */
  @Input() size: LoaderSize = 'md';

  /** Gets the size in pixels for the Loaderner based on the size input. */
  get sizeInPx(): number {
    switch (this.size) {
      case 'sm':
        return 45;
      case 'md':
        return 70;
      case 'lg':
        return 110;
      default:
        return 70;
    }
  }
}
