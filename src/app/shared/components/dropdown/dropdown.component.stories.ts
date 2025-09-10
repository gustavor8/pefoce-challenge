import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { DropdownComponent, DropdownOption } from './dropdown.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

const mockOptions: DropdownOption<string>[] = [
  { label: 'Maçã', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Uva', value: 'grape' },
  { label: 'Laranja', value: 'orange' },
  { label: 'Morango', value: 'strawberry' },
  { label: 'Abacaxi', value: 'pineapple' },
];

const meta: Meta<DropdownComponent<any>> = {
  title: 'Components/Dropdown',
  component: DropdownComponent,

  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, DropdownComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'A lista de opções a serem exibidas no dropdown.',
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido quando nenhuma opção está selecionada.',
    },
    multiSelect: {
      control: 'boolean',
      description: 'Permite a seleção de múltiplas opções.',
    },
    clearable: {
      control: 'boolean',
      description: 'Exibe um botão para limpar a seleção.',
    },
    searchable: {
      control: 'boolean',
      description: 'Habilita um campo de busca dentro do dropdown.',
    },

    optionTpl: {
      control: false,
      table: { disable: true },
    },
    selectedTpl: {
      control: false,
      table: { disable: true },
    },

    writeValue: { table: { disable: true } },
    registerOnChange: { table: { disable: true } },
    registerOnTouched: { table: { disable: true } },
    setDisabledState: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<DropdownComponent<any>>;

export const Default: Story = {
  args: {
    options: mockOptions,
    placeholder: 'Selecione uma fruta',
  },
};

export const MultiSelect: Story = {
  args: {
    ...Default.args,
    multiSelect: true,
    placeholder: 'Selecione uma ou mais frutas',
  },
};

export const WithSearch: Story = {
  args: {
    ...Default.args,
    searchable: true,
  },
};

export const Clearable: Story = {
  args: {
    ...Default.args,
    clearable: true,
  },

  render: (args) => {
    const form = new FormControl('banana');
    return {
      props: { ...args, form },
      template: `<app-dropdown [formControl]="form" ${argsToTemplate(
        args
      )}></app-dropdown>`,
    };
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: 'Dropdown desabilitado',
  },

  render: (args) => {
    const form = new FormControl({ value: 'apple', disabled: true });
    return {
      props: { ...args, form },
      template: `<app-dropdown [formControl]="form" ${argsToTemplate(
        args
      )}></app-dropdown>`,
    };
  },
};

export const WithReactiveForm: Story = {
  args: {
    ...MultiSelect.args,
    clearable: true,
    searchable: true,
  },
  render: (args) => {
    const form = new FormControl(['apple', 'grape']);

    return {
      props: {
        ...args,
        form,
      },
      template: `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <p>Este dropdown está conectado a um FormControl do Angular.</p>
            <app-dropdown [formControl]="form" ${argsToTemplate(
              args
            )}></app-dropdown>
            <pre>Valor do Formulário: {{ form.value | json }}</pre>
            <button (click)="form.disable()" [disabled]="form.disabled">Desabilitar</button>
            <button (click)="form.enable()" [disabled]="!form.disabled">Habilitar</button>
        </div>
      `,
    };
  },
};
