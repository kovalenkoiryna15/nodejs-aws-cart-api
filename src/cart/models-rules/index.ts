import { Cart, CartItem } from '../models/cart';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart ? cart.items.reduce((acc: number, item: CartItem) => {
    if (item.product) {
      return acc += item.product.price * item.count;
    }
    return acc;
  }, 0) : 0;
}
