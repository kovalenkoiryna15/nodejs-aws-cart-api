import { Address, OrderItem } from "../models/order";

export class CreateOrderDto {
  items: OrderItem[];

  address: Address;
}
