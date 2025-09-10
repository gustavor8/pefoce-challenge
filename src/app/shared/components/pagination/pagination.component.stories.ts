import { Meta, StoryObj } from '@storybook/angular';
import { PaginationComponent } from './pagination.component';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<PaginationComponent> = {
    title: 'Components/Pagination',
    component: PaginationComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [PaginationComponent],
        }),
    ],
    args: {
        page: 1,
        itemsPerPage: 2,
        collectionSize: 5,
        pageSizes: [1, 2, 10],
    },
};

export default meta;

type Story = StoryObj<PaginationComponent>;

export const Default: Story = {
    args: {},
};
