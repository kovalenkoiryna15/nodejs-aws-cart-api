import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';
import { DatabaseModule } from 'src/db/db.module';


@Module({
  imports: [ OrderModule, DatabaseModule ],
  providers: [ CartService ],
  controllers: [ CartController ],
})
export class CartModule {}
