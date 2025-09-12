import { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

export type TagVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    type: 'primary' as TagVariant,
    additionalClasses: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Texto a ser exibido no badge.',
    },
    type: {
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      },
      description: 'Define o tipo do tag.',
    },
    additionalClasses: {
      control: 'text',
      description: 'classe adicional.',
    },
    onClick: {
      action: 'clicked',
      description: 'Evento disparado ao clicar no badge.',
      type: { name: 'function', required: false },
    }
  },
};

export default meta;

type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  argTypes: {
    label: String,
    type: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      },
      description: 'Define o tipo do tag.',
    },
  },
};

export const Success: Story = {
  args: {
    label: 'Success Tag',
    type: 'success',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Tag',
    type: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger Tag',
    type: 'danger',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning Tag',
    type: 'warning',
  },
};

export const Info: Story = {
  args: {
    label: 'Info Tag',
    type: 'info',
  },
};

export const PrimaryWithOnClick: Story = {
  args: {
    label: 'OnClick Tag',
    type: 'primary',
    onClick: () => console.log('Badge clicked!'),
  },
};