import type { Meta, StoryObj } from '@storybook/react';
import { CartFragment } from '../components/CartFragment';

const meta: Meta<typeof CartFragment> = {
  title: 'Fragments/CartFragment',
  component: CartFragment,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartFragment>;

export const DefaultCart: Story = {
  args: {
    cartId: 'cart_active_session',
    onVerifyFitmentClick: (prodId) => alert(`Navigating to test fitment for: ${prodId}`),
    onProceedToCheckout: (cart) => alert(`Proceeding to checkout with ${cart.total_items_count} items!`),
  },
};
