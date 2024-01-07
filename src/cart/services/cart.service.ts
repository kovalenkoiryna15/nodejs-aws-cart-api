import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem, CartStatuses } from '../models/cart';
import { InjectRepository } from '@nestjs/typeorm';
import { Carts } from 'src/db/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItems } from 'src/db/entities/cart-item.entity';
import { Products } from 'src/db/entities/products.entity';

@Injectable()
export class CartService {
  // private userCarts: Record<string, Cart> = {};

  constructor(
    @InjectRepository(Carts) private readonly cartRepo: Repository<Carts>,
    @InjectRepository(CartItems) private readonly cartItemsRepo: Repository<CartItems>,
    @InjectRepository(Products) private readonly productsRepo: Repository<Products>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    // return this.userCarts[ userId ];
    
    try {
      const cart = await this.cartRepo.findOne({
        where: { user_id: userId },
        relations: ['items', 'items.product']
      });
      return cart;
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    const date = new Date().toISOString().split('T')[0];
    const id = v4();
    const userCart: Cart = {
      id,
      user_id: userId,
      created_at: date,
      updated_at: date,
      status: CartStatuses.OPEN,
      items: [],
    };

    // this.userCarts[ userId ] = userCart;
    try {
      await this.cartRepo.insert(userCart);
      return userCart;
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  async findOrCreateCartByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async findByCartIdAndProductId(cartId: string, productId: string): Promise<CartItem> {
    return this.cartItemsRepo.findOneBy({ cart_id: cartId, product_id: productId });
  }

  async createCartItemByCartId(cartId: string, cartItem: CartItem): Promise<CartItem> {
    const newCartItem: Partial<CartItems> = {
      cart_id: cartId,
      product_id: cartItem.product.id,
      count: cartItem.count,
    };

    try {
      await this.cartItemsRepo.insert(newCartItem);
      return this.cartItemsRepo.findOneBy({ cart_id: cartId, product_id: cartItem.product.id });
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  async updateCartItemsByUserId(userId: string, cartItem: CartItem): Promise<Cart> {
    const cart = await this.findOrCreateCartByUserId(userId);
    const product = await this.findProductById(cartItem.product.id);

    if (product) {
      if (cartItem.count > 0) {
        const item = await this.findByCartIdAndProductId(cart.id, cartItem.product.id);
    
        if (item) {
          await this.cartItemsRepo.update({ cart_id: cart.id, product_id: cartItem.product.id }, { count: cartItem.count });
        } else {
          await this.createCartItemByCartId(cart.id, cartItem);
        }  
      } else {
        await this.cartItemsRepo.delete({ cart_id: cart.id, product_id: cartItem.product.id });
      }
    
      return this.findByUserId(userId);
    }

    return null;
  }

  async updateCartByUserId(userId: string, status: CartStatuses): Promise<Cart> {
    const cart = await this.findOrCreateCartByUserId(userId);

    await this.cartRepo.update({ id: cart.id }, { status });

    return { ...cart, status };
  }

  async removeByUserId(userId): Promise<void> {
    // this.userCarts[ userId ] = null;
    await this.cartRepo.delete({ user_id: userId });
  }

  async findProductById(productId: string): Promise<Products> {
    try {
      const product = await this.productsRepo.findOne({
        where: { id: productId },
      });
      return product;
    } catch(err) {
      console.error(err);
      return null;
    }
  }
}
