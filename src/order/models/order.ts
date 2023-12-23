import { CartItem } from "src/cart/models/cart";

export type OrderItem = {
  productId: string,
  count: number,
};

export type Address = {
  firstName: string,
  lastName: string,
  address: string,
  comment: string,
};

export type Payment = {
  type: string,
  address?: string,
  creditCard?: string,
};

export type Delivery = {
  type: string,
  address: string,
};

export type Order = {
  id?: string,
  user_id: string,
  cart_id: string,
  payment: Payment,
  delivery: Delivery,
  comments: string,
  status: string,
  total: number;
};

export type OrderWithItems = Omit<Order, 'id'> & {
  items: CartItem[],
};
