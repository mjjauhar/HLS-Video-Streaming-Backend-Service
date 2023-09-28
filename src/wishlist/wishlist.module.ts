import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { wishlist_schema } from './schema/wishlist.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'wishlist', schema: wishlist_schema }]),
    // UsersModule
  ],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports:[WishlistService]
})
export class WishlistModule {}
