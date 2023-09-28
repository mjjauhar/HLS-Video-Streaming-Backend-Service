import { Controller, Get, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/')
  @Permissions(Permission.ACCESS_CONTENT)
  getWalletBalance(@Req() request){
    return this.walletService.getWalletBalance(request.user_id)
  }
}
