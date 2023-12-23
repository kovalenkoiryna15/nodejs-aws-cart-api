import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Carts } from "./cart.entity";
import { Products } from "./products.entity";
import { Product } from "src/cart/models/cart";

@Entity()
export class CartItems {
  @PrimaryColumn({ type: 'uuid',  nullable: false })
  @ManyToOne(() => Carts, (cart) => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart_id: string;

  @PrimaryColumn({ type: 'uuid',  nullable: false })
  product_id: string;
  
  @ManyToOne(() => Products, (product) => product.id)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: 'integer', nullable: false })
  count: number;
}