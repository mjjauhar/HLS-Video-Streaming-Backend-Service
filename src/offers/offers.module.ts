import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';

@Module({
  providers: [OffersService],
  controllers: [OffersController]
})
export class OffersModule {}
