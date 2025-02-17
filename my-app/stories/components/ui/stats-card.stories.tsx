import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from '@/components/ui/stats-card';

const meta: Meta<typeof StatsCard> = {
  title: 'Components/UI/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    title: 'Stats Name',
    explanation: 'This is an explanation of what this stat means and how it is calculated.',
  },
};

export const WithCustomContent: Story = {
  args: {
    title: 'Microbiome Balance',
    explanation: 'A measure of the overall health and diversity of your skin microbiome.',
    children: (
      <div className="w-full h-40 bg-blue-100 rounded-lg flex items-center justify-center">
        Custom Chart or Content Here
      </div>
    ),
  },
}; 