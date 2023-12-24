import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order, OrderResponse } from '../models/order';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from 'src/db/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
  ) {}

  async getOrders(): Promise<OrderResponse[]> {
    const orders = await this.ordersRepo.find();
    return orders.map((data: Orders) => this.createOrderResponse(data));
  }

  async findOrdersByUserId(userId: string): Promise<OrderResponse> {
    const data = await this.ordersRepo.findOneBy({ user_id: userId });
    return this.createOrderResponse(data);
  }

  async findOrdersById(userId: string, orderId: string): Promise<Order> {
    return this.ordersRepo.findOneBy({ user_id: userId, id: orderId });
  }

  async updateOrder(order: Order): Promise<OrderResponse> {
    const data: Orders = await this.ordersRepo.save(order);
    return this.createOrderResponse(data);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.ordersRepo.delete({ id: orderId });
  }

  async updateOrderStatus(orderId: string, updated: any): Promise<void> {
    await this.ordersRepo.save({ id: orderId }, {
      ...updated,
    });
  }

  async create(data: Omit<Orders, 'id'>): Promise<OrderResponse> {
    const order: Order = {
      id: v4(),
      ...data,
    };

    return this.updateOrder(order);
  }


  createOrderResponse(order: Orders): OrderResponse {
    const { id, user_id, cart_id, items, status, statusHistory, payment, delivery, total, comments }: Orders = order;
    return {
      id, user_id, cart_id, items, status, statusHistory, total,
      address: {
        firstName: payment.firstName,
        lastName: payment.lastName,
        address: delivery.address,
        comment: comments,
      }
    };
  }
}
