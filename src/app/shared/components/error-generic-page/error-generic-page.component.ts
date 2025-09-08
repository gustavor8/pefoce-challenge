import { Component, inject, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-generic-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './error-generic-page.component.html',
  styleUrl: './error-generic-page.component.scss',
})
export class ErrorGenericPageComponent {
  @Input() errorCode!: string;
  @Input() errorTitle!: string;
  @Input() errorMessage!: string;
  @Input() buttonText!: string;
  @Input() buttonLink!: string;
  router = inject(Router);

  goToPage() {
    this.router.navigateByUrl(this.buttonLink);
  }
}
