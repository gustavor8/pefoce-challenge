import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorGenericPageComponent } from '../../shared/components/error-generic-page/error-generic-page.component';

@Component({
  selector: 'app-erro-page',
  imports: [ErrorGenericPageComponent],
  templateUrl: './erro-page.component.html',
  styleUrl: './erro-page.component.scss',
})
export class ErroPageComponent {
  route = inject(ActivatedRoute);
  errorCode = '404';
  errorTitle = 'Página não encontrada';
  errorMessage =
    'Ops... Página não localizada. Parece que vocês buscou algo que não existe no sistema, caso necessário entre em contato!';
  buttonText = 'Voltar ao início';
  buttonLink: string = '/home';

  constructor() {}
}
