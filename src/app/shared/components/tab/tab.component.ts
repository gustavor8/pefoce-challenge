// tab.component.ts
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  signal,
} from '@angular/core';
import { IconName } from '../icon/icon.types';

@Component({
  selector: 'app-tab',
  standalone: true,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class TabComponent {
  @Input({ required: true }) title = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() iconName?: IconName;


  @ViewChild(TemplateRef, { static: true }) content!: TemplateRef<any>;

  public isActive = signal<boolean>(false);
}
