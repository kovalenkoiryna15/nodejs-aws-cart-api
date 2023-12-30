import { Delivery, OrderStatus, Payment, StatusHistory } from "src/order/models/order";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "src/cart/models/cart";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  cart_id: string;

  @Column({ type: 'json', nullable: true })
  payment: Payment;

  @Column({ type: 'json', nullable: true })
  delivery: Delivery;

  @Column({ type: 'json', nullable: true })
  items: CartItem[];

  @Column({ type: 'json', nullable: true })
  statusHistory: StatusHistory[];

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: Object.values(OrderStatus), nullable: false })
  status: OrderStatus;

  @Column({ type: 'integer' })
  total: number;
}