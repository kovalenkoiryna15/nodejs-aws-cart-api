import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';

import { BasicAuthGuard } from '../auth/guards/bacis-auth.guard';
import { OrderService } from '../order/services/order.service';
import { getUserIdFromRequest } from '../shared/models-rules';
import { AppRequest } from '../shared/models';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services/cart.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderResponse, OrderStatus } from 'src/order/models/order';
import { CartStatuses } from './models/cart';

@ApiTags('Cart')
@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateCartByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const cart = await this.cartService.updateCartItemsByUserId(getUserIdFromRequest(req), body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order: OrderResponse = await this.orderService.create({ // TODO: validate and pick only necessary data
      user_id: userId,
      cart_id: cartId,
      payment: {
        type: 'card',
        address: body.address.address,
        creditCard: '**** **** **** ****',
        firstName: body.address.firstName,
        lastName: body.address.lastName,
      },
      delivery: { type: 'dhl', address: body.address.address },
      comments: body.address.comment,
      status: OrderStatus.Open,
      statusHistory: [OrderStatus.Open],
      items,
      total,
    });
    // this.cartService.removeByUserId(userId);
    this.cartService.updateCartByUserId(getUserIdFromRequest(req), CartStatuses.ORDERED);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
