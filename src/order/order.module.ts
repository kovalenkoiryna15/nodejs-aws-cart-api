import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { DatabaseModule } from 'src/db/db.module';
import { OrderController } from './order.controller';

@Module({
  providers: [ OrderService ],
  exports: [ OrderService ],
  controllers: [ OrderController ],
  imports: [ DatabaseModule ],
})
export class OrderModule {}
