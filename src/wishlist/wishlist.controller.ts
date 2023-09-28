import { Controller,Get,Req,Post,Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';


@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService:WishlistService){}

    @Get('/')
    @Permissions(Permission.ACCESS_CONTENT)
    getWishlist(@Req() req){
        return this.wishlistService.getWishlist(req.user_id)
    }

    @Post('/add')
    @Permissions(Permission.ACCESS_CONTENT)
    addToWishlist(@Req() req,@Query('id') id){
        return this.wishlistService.addToWishList(req.user_id,id)
    }

    @Post('/remove')
    @Permissions(Permission.ACCESS_CONTENT)
    removeFromWishlist(@Req() req,@Query('id') id){
        return this.wishlistService.removeFromWishList(req.user_id,id)
    }
}
