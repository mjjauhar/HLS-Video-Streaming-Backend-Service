import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { walletSchema } from './schema/wallet.schema';
import { faculty_schema } from 'src/faculties/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'wallet', schema: walletSchema },
      { name: 'faculty', schema: faculty_schema },
    ]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
