import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { wallet } from './schema/wallet.schema';
import { Model } from 'mongoose';
import { faculty } from 'src/faculties/schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(wallet.name) private readonly walletModel: Model<wallet>,
    @InjectModel(faculty.name) private readonly facultyModel: Model<faculty>,
  ) {}

  async addBalance(user_id: string, amount: number) {
    const walletExists = await this.walletModel.findOne({ user_id: user_id });
    
    if (walletExists) {
      const newBalance = parseInt(walletExists.balance) + amount;
      console.log(newBalance);
      
      await this.walletModel.updateOne(
        { user_id },
        { $set: { balance: newBalance } },
      );
    } else {
      const wallet = await this.walletModel.create({
        user_id,
        balance: amount,
      });
    }
  }

  async getWalletBalance(user_id: string) {
    const faculty = await this.facultyModel.findOne({user_id})
    console.log(faculty);
    
    const walletExists = await this.walletModel.findOne({ user_id: faculty._id });
    if (walletExists) {
      return walletExists;
    } else {
      const wallet = await this.walletModel.create({ user_id:faculty._id, balance: 0 });
      return wallet;
    }
  }
}
