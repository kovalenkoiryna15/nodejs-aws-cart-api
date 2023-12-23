import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order, OrderWithItems } from '../models/order';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from 'src/db/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
  ) {}

  async getOrders(): Promise<Order[]> {
    return this.ordersRepo.find();
  }

  async findOrdersByUserId(userId: string): Promise<Order> {
    const order = await this.ordersRepo.findOneBy({ user_id: userId });
    return order;
  }

  async findOrdersById(userId: string, orderId: string): Promise<Order> {
    return this.ordersRepo.findOneBy({ user_id: userId, id: orderId });
  }

  async updateOrder(order: Order): Promise<Omit<Order, 'id'>> {
    const { id, ...res }: Order = await this.ordersRepo.save(order);
    return res;
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.ordersRepo.delete({ id: orderId });
  }

  async updateOrderStatus(orderId: string, updated: any): Promise<void> {
    await this.ordersRepo.save({ id: orderId }, {
      ...updated,
    });
  }

  async create(data: Omit<OrderWithItems, 'id'>): Promise<Omit<Order, 'id'>> {
    const order: Order = {
      id: v4(),
      ...data,
    };

    return this.updateOrder(order);
  }
}
