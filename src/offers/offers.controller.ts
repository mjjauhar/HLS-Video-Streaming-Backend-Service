import { Body, Controller, Get, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OffersService } from './offers.service';
import { ConfigService } from '@nestjs/config';
import jwtDecode from 'jwt-decode';
import { thumbnailUploadInterceptor } from 'src/shared/helper';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersSerive: OffersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getOffers(@Request() req) {
    const result: any = await jwtDecode(req.headers.authorization);
    return this.offersSerive.getOffers(result.loyalty_token);
  }

  @Post()
  @UseInterceptors(thumbnailUploadInterceptor())
  async addOffer(@Body() dto, @Request() req,@UploadedFile() file: Express.Multer.File) {
    const result: any = await jwtDecode(req.headers.authorization);
    return this.offersSerive.addOffer(dto, result.loyalty_token,file);
  }
}
