import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order, OrderResponse, StatusHistory } from '../models/order';
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

  async findOrdersById(userId: string, orderId: string): Promise<OrderResponse> {
    const data = await this.ordersRepo.findOneBy({ user_id: userId, id: orderId });
    return this.createOrderResponse(data);
  }

  async updateOrder(order: Order): Promise<OrderResponse> {
    const data: Orders = await this.ordersRepo.save(order);
    return this.createOrderResponse(data);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.ordersRepo.delete({ id: orderId });
  }

  async updateOrderStatusHistory(orderId: string, newStatus: Omit<StatusHistory, 'timestamp'>): Promise<void> {
    const order = await this.ordersRepo.findOneBy({ id: orderId });
    await this.ordersRepo.update({ id: orderId }, {
      status: newStatus.status,
      statusHistory: [ 
        ...order.statusHistory, 
        { 
          status: newStatus.status, 
          timestamp: Date.now(),
          comment: newStatus.comment,
        }, 
      ],
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
