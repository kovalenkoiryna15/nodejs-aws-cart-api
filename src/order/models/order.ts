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
  firstName: string;
  lastName: string;
};

export type Delivery = {
  type: string,
  address: string,
};

export enum OrderStatus {
  Open = "OPEN",
  Approved = "APPROVED",
  Confirmed = "CONFIRMED",
  Sent = "SENT",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export type Order = {
  id?: string,
  user_id: string,
  cart_id: string,
  payment: Payment,
  delivery: Delivery,
  comments: string,
  status: OrderStatus,
  total: number;
  statusHistory: OrderStatus[];
};

export type OrderResponse = Omit<Order, 'payment' | 'delivery' | 'comments'> & {
  items: CartItem[],
  address: Address;
};
