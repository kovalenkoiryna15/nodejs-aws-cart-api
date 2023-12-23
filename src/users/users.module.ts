import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { DatabaseModule } from 'src/db/db.module';

@Module({
  providers: [ UsersService ],
  exports: [ UsersService ],
  imports: [ DatabaseModule ],
})
export class UsersModule {}
