import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TableColumn, TableAction, TableConfig, TableComponent } from './table.component';
import { BadgeComponent } from '../badge/badge.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProfileComponent } from '../profile/profile.component';

const generateUsers = (count: number = 20) => {
  const statuses = ['success', 'danger', 'warning', 'info', 'primary'];
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Salvador'];
  const departments = ['TI', 'RH', 'Vendas', 'Marketing', 'Financeiro'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Usuário ${i + 1}`,
    email: `usuario${i + 1}@empresa.com`,
    phone: `+55 11 9999-${String(i + 1).padStart(4, '0')}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dateJoined: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pt-BR'),
    salary: Math.floor(Math.random() * 10000) + 3000,
    active: Math.random() > 0.3,
    canEdit: true,
    canDelete: Math.random() > 0.2
  }));
};


const meta: Meta<TableComponent> = {
  title: 'Components/Table',
  component: TableComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BadgeComponent,
        DropdownComponent,
        IconButtonComponent,
        PaginationComponent,
        ProfileComponent
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de tabela dinâmica e configurável com suporte a ordenação, paginação, seleção múltipla e ações customizadas.'
      }
    }
  },
  argTypes: {
    data: {
      description: 'Array de dados para exibir na tabela',
    },
    columns: {
      description: 'Configuração das colunas da tabela',
    },
    actions: {
      description: 'Ações disponíveis para cada linha',
    },
    config: {
      description: 'Configurações gerais da tabela',
    },
    selectedRowsChange: {
      description: 'Evento emitido quando linhas são selecionadas',
      action: 'selectedRowsChange'
    },
    sortChange: {
      description: 'Evento emitido quando ordenação muda',
      action: 'sortChange'
    },
    pageChange: {
      description: 'Evento emitido quando página muda',
      action: 'pageChange'
    }
  }
};

export default meta;
type Story = StoryObj<TableComponent>;

// Story básica
export const Default: Story = {
  args: {
    data: generateUsers(50),
    columns: [
      {
        key: 'name',
        label: 'Nome',
        type: 'profile',
        sortable: true,
        profileConfig: {
          imageKey: 'avatar',
          nameKey: 'name',
          subtitleKey: 'email',
          size: 'sm'
        }
      },
      {
        key: 'department',
        label: 'Departamento',
        type: 'text',
        sortable: false
      },
      {
        key: 'city',
        label: 'Cidade',
        type: 'text',
        sortable: false
      },
      {
        key: 'dateJoined',
        label: 'Entrada',
        type: 'text',
        sortable: true
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        sortable: false,
        badgeConfig: {
          typeKey: 'status',
          valueKey: 'status'
        }
      }
    ],
    actions: [
      {
        icon: 'edit',
        label: 'Editar usuário',
        action: (e) => console.log('Editar usuário: '),
      },
      {
        icon: 'delete',
        label: 'Deletar usuário',
        // condition: (item) => item.canDelete,
        action: (e) => {
          console.log('e', e)
          console.log('Deletar usuário: ')
        },
      }
    ],
    config: {
      showColumnSelector: true,
      showPagination: true,
      sortable: true,
      selectable: true,
      defaultPageSize: 10
    },
    selectedRowsChange: () => console.log('selectedRowsChange'),
    sortChange: () => console.log('sortChange'),
    pageChange: () => console.log('pageChange')
  }
};

// Tabela simples sem seleção
export const Simple: Story = {
  args: {
    data: generateUsers(8),
    columns: [
      { key: 'name', label: 'Nome', type: 'text', sortable: true },
      { key: 'email', label: 'E-mail', type: 'text', sortable: true },
      { key: 'department', label: 'Departamento', type: 'text', sortable: true }
    ],
    actions: [
      {
        icon: 'eye',
        label: 'Ver detalhes',
        action: () => console.log('Ver detalhes')
      }
    ],
    config: {
      showCheckboxes: false,
      showColumnSelector: false,
      showPagination: true,
      sortable: true,
      selectable: false,
      responsive: true,
      hover: true,
      striped: true,
      defaultPageSize: 10
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Tabela simples sem checkboxes de seleção e com visual listrado.'
      }
    }
  }
};
