import { type Meta, type StoryObj } from '@storybook/angular';
import { InputMask, TextInputComponent } from './text-input.component';
import { ICONS } from '../icon/icon.config';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { cpfMask } from '../../shared/masks';

const NO_ICON = 'none';

const placaVeiculoMask: InputMask = {
  allowedCharsRegex: /[a-zA-Z0-9]/,
  maskFn: (value: string): string => {
    if (!value) return '';
    const cleaned = value.toUpperCase().slice(0, 7);
    return cleaned;
  },
};

const meta: Meta<TextInputComponent> = {
  title: 'Components/Text Input',
  component: TextInputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    helperText: {
      control: 'text',
      description: 'Texto de ajuda opcional exibido abaixo do input.',
    },
    maxLength: {
      control: 'number',
      description: 'Número máximo de caracteres permitidos.',
    },
    showCharCounter: {
      control: 'boolean',
      description: 'Exibe um contador de caracteres.',
    },
    iconPosition: {
      control: 'radio',
      options: ['prefix', 'suffix'],
    },
    disabled: {
      control: 'boolean',
    },
    readonly: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    mask: {
      control: false,
      description:
        'Uma função que aplica uma máscara ao valor do input. Ex: (value) => maskedValue',
    },
    icon: {
      control: { type: 'select' },
      options: [NO_ICON, ...Object.keys(ICONS)],
      mapping: {
        [NO_ICON]: undefined,
      },
      description: 'Ícone opcional a ser exibido.',
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    disabled: false,
    readonly: false,
  },
};

export default meta;
type Story = StoryObj<TextInputComponent>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    type: 'text',
  },
};

export const WithIcon: Story = {
  name: 'With Icon ',
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    icon: 'at',
  },
};

export const Email: Story = {
  args: {
    label: 'E-mail',
    placeholder: 'seu.email@exemplo.com',
    type: 'email',
    icon: 'at',
  },
};

export const Password: Story = {
  args: {
    label: 'Senha',
    placeholder: 'Digite sua senha',
    type: 'password',
  },
};

export const NumberPositiveOnly: Story = {
  args: {
    label: 'Quantidade',
    placeholder: 'Ex: 10',
    type: 'number',
  },
};

export const NumberWithNegatives: Story = {
  args: {
    label: 'Temperatura (°C)',
    placeholder: 'Ex: -5',
    type: 'number',
    allowNegative: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Campo com Ajuda',
    placeholder: 'Digite algo aqui',
    helperText: 'Este é um texto de ajuda útil.',
  },
};

export const WithCharCounter: Story = {
  args: {
    label: 'Descrição',
    placeholder: 'Máximo de 150 caracteres',
    showCharCounter: true,
    maxLength: 150,
    helperText: 'Descreva seu item brevemente.',
  },
};

export const WithCounterOnly: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Digite seu feedback',
    showCharCounter: true,
  },
};

export const WithCPFMask: Story = {
  name: 'With Mask (CPF)',
  args: {
    label: 'CPF',
    placeholder: '000.000.000-00',
    mask: cpfMask,
  },
};

export const WithAlphanumericMask: Story = {
  args: {
    label: 'Placa do Veículo',
    placeholder: 'ABC1D23',
    mask: placaVeiculoMask,
    maxLength: 7,
  },
};
export const Disabled: Story = {
  args: {
    label: 'Label',
    value: 'Placeholder',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'ID do Usuário',
    value: 'USR-123456789',
    readonly: true,
  },
};

//Componente Wrapper para a história do formulário de login
@Component({
  selector: 'app-login-form-story',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    ButtonComponent,
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <app-text-input
        label="E-mail"
        type="email"
        placeholder="seu.email@exemplo.com"
        formControlName="email"
        icon="at"
        [errorMessages]="errorMessages"
      ></app-text-input>

      <app-text-input
        label="Senha"
        type="password"
        icon="lock"
        placeholder="Digite sua senha"
        formControlName="password"
        [errorMessages]="errorMessages"
      ></app-text-input>

      <app-button
        type="submit"
        [label]="buttonLabel"
        [loading]="isLoading"
        [disabled]="!loginForm.valid || isSuccess"
        fullWidth="true"
      ></app-button>
    </form>
  `,
})
class LoginFormStoryComponent {
  loginForm: FormGroup;
  isLoading = false;
  isSuccess = false;

  errorMessages = {
    required: 'Este campo é obrigatório.',
    email: 'Por favor, insira um e-mail válido.',
  };

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 2000);
  }
}

export const LoginFormExample: Story = {
  name: 'Example: Login Form',
  render: () => ({
    moduleMetadata: {
      imports: [LoginFormStoryComponent],
    },
    template: `<app-login-form-story></app-login-form-story>`,
  }),
};

LoginFormExample.parameters = {
  docs: {
    source: {
      language: 'typescript',
      code: `
// =============== 1. Lógica do Componente (.ts) ===============

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconName } from './icon/icon.types'; // Ajuste o caminho do import

@Component({
  // ...
})
export class MyFormComponent {
  loginForm: FormGroup;
  isLoading = false;
  isSuccess = false;

  errorMessages = {
    required: 'Este campo é obrigatório.',
    email: 'Por favor, insira um e-mail válido.',
  };

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 2000);
  }
}


// =============== 2. Template do Componente (.html) ===============

<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <app-text-input
    label="E-mail"
    type="email"
    placeholder="seu.email@exemplo.com"
    formControlName="email"
    icon="at"
    [errorMessages]="errorMessages"
  ></app-text-input>

  <app-text-input
    label="Senha"
    type="password"
    placeholder="Digite sua senha"
    formControlName="password"
    [errorMessages]="errorMessages"
  ></app-text-input>

  <app-button
    type="submit"
    [label]="buttonLabel"
    [loading]="isLoading"
    [disabled]="!loginForm.valid || isSuccess"
    fullWidth="true"
  ></app-button>
</form>
      `,
    },
  },
};
