import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRuleDto, UpdateRuleDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rule } from './type';

@Injectable()
export class RuleService {
  constructor(
    @InjectModel('rule') private RuleModel: Model<rule>,
  ) { }

  //GET ALL NON-BLOCKED RULES
  async findAll() {
    try {
      return await this.RuleModel.find({ status: 2 });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED RULE
  async findOne(rule_id: string) {
    try {
      return await this.RuleModel.findOne({ _id: rule_id, status: 2 });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //UPDATE A RULE
  async updateRule(updateRuleDto: UpdateRuleDto, rule_id: string) {
    try {
      const rule = await this.RuleModel.findOne({ _id: rule_id });
      return await this.RuleModel.updateOne(
        { _id: rule._id },
        { $set: updateRuleDto },
      );
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //CREATE A NEW RULE
  async createRule(createRuleDto: CreateRuleDto) {
    try {
      const created_rule = new this.RuleModel(createRuleDto);
      await created_rule.save();
      return created_rule;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Rule already exist. No duplicate rule is allowed.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error, 400, {
        cause: new Error(error.message),
      });
    }
  }

  //DELETE A RULE
  async delete(rule_id: string) {
    try {
      return await this.RuleModel.deleteOne({ _id: rule_id });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }
}
