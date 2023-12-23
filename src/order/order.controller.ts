import { Controller, Get, Delete, Put, Body, Req, UseGuards, HttpStatus, Param } from '@nestjs/common';

import { BasicAuthGuard } from '../auth/guards/bacis-auth.guard';
import { OrderService } from '../order/services/order.service';
import { AppRequest } from '../shared/models';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) { }

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAllOrders() {
    const orders = await this.orderService.getOrders();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { orders },
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async submitOrder(@Req() req: AppRequest, @Body() body) {
    const order = await this.orderService.updateOrder(body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async findOrder(@Req() req: AppRequest, @Param('id') orderId: string) {
    const order = await this.orderService.findOrdersById(req.user.id, orderId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteOrder(@Req() req: AppRequest, @Param('id') orderId: string) {
    const order = await this.orderService.deleteOrder(orderId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/status')
  async updateOrderStatus(@Req() req: AppRequest, @Param('id') orderId: string, @Body() body) {
    const order = await this.orderService.updateOrderStatus(orderId, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    }
  }
}
