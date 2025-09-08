import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorGenericPageComponent } from '../../../shared/components/error-generic-page/error-generic-page.component';

@Component({
  selector: 'app-erro-page',
  imports: [ErrorGenericPageComponent],
  templateUrl: './erro-page.component.html',
  styleUrl: './erro-page.component.scss',
})
export class ErroPageComponent {
  route = inject(ActivatedRoute);
  errorCode!: string;
  errorTitle!: string;
  errorMessage!: string;
  buttonText!: string;
  buttonLink: string = '/home';

  constructor() {
    const data = this.route.snapshot.data;
    this.errorCode = data['errorCode'];
    this.errorTitle = data['errortitle'];
    this.errorMessage = data['errorMessage'];
    this.buttonText = data['buttonText'];
  }
}
