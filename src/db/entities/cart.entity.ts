import { CartItem, CartStatuses } from "src/cart/models/cart";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItems } from "./cart-item.entity";
import { Orders } from "./order.entity";
import { Order } from "src/order/models/order";

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'date', nullable: false })
  created_at: string;

  @Column({ type: 'date', nullable: false })
  updated_at: string;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'], nullable: false })
  status: CartStatuses;

  @OneToMany(() => CartItems, (item: CartItems) => item.cart_id)
  @JoinColumn({ name: "id" })
  items: CartItem[];

  @OneToMany(() => Orders, (item: Orders) => item.cart_id)
  @JoinColumn({ name: "id" })
  orders: Order[];
}
