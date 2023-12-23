import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Carts } from "./entities/cart.entity";
import { CartItems } from "./entities/cart-item.entity";
import { Products } from "./entities/products.entity";
import { Users } from "./entities/users.entity";
import { Orders } from "./entities/order.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Orders, Carts, CartItems, Products, Users],
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
      ssl: { 
        rejectUnauthorized: false, 
      }
    }),
    TypeOrmModule.forFeature([Orders, Carts, CartItems, Products, Users])
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
