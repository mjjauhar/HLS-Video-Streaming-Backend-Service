import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createOfferDto } from './dto/offer.create.dto';
import { createReadStream } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class OffersService {
  constructor(private readonly configService: ConfigService) {}
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  async getOffers(loyalty_token: string) {
    const response = await axios.get(
      `${this.configService.get<string>(
        'LOYALTY_API',
      )}/offers/category-offers/COURSE`,
      {
        headers: { Authorization: `Bearer ${loyalty_token}` },
      },
    );
    return response.data;
  }

  async addOffer(
    dto: createOfferDto,
    loyalty_token: string,
    file: Express.Multer.File,
  ) {
    try {
      const bucket_name = this.configService.get<string>('AWS_S3_BUCKET');
      const aws_s3_folder_path =
        this.configService.get<string>('AWS_S3_FOLDER_PATH');
      const folder_path = `${aws_s3_folder_path}/cc7e1a75-b3f3-4ced-88ae-0d9e886559fd`;

      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket_name,
        Key: `${folder_path}/${file}`,
        Body: createReadStream(`temp/thumbnail/` + file.filename),
      });

      console.log(file);
      await this.s3Client.send(command);

      const thumbnail_url = `https://${bucket_name}.s3.ap-south-1.amazonaws.com/${folder_path}/${file.filename}`;
      console.log(thumbnail_url);
      const body = {
        title: dto.title,
        description: dto.description,
        expiry: dto.expiry,
        category_id: '64b101c5bc8ac4e445f88159',
        start: dto.start,
        url: dto.url,
        contact: dto.contact,
      };
      const response = await axios.post(
        `${this.configService.get<string>(
          'LOYALTY_API',
        )}/offers/add-external-offer`,
        {
          dto,
        },
        {
          headers: { Authorization: `Bearer ${loyalty_token}` },
        },
      );
      console.log(response);
      
    } catch (error) {
      console.log(error.data);
    }
  }
}
