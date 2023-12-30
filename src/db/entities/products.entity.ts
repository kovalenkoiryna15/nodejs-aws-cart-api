import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItems } from "./cart-item.entity";

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => CartItems, (item: CartItems) => item.product)
  id: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer' })
  price: number;
}