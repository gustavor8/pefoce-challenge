import { Component, inject } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [TextInputComponent, ButtonComponent, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessages = {
    required: 'Este campo é obrigatório.',
    username: 'Por favor, insira um usuário válido.',
    errorLogin: '',
  };

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get buttonLabel(): string {
    if (this.isSuccess) return 'Login bem-sucedido!';
    return 'Entrar';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginForm.disable();
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 0) {
          this.errorMessages.errorLogin =
            'Não foi possível conectar ao servidor.';
        } else if (err.status === 500) {
          this.errorMessages.errorLogin =
            'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (err.status === 401) {
          this.errorMessages.errorLogin = 'Usuário ou senha inválidos.';
        } else if (err.status === 404) {
          this.errorMessages.errorLogin = 'Erro na requisição.';
        }
        //mensagem personalizada do backend
        else if (err.error && err.error.message) {
          this.errorMessages.errorLogin = err.error.message;
        }
        //mensagens genéricas do Angular
        else if (err.message) {
          this.errorMessages.errorLogin = err.message;
        } else {
          this.errorMessages.errorLogin = 'Erro: ' + JSON.stringify(err.error);
        }
      },
    });
    this.isLoading = false;
    this.loginForm.enable();
  }
}
