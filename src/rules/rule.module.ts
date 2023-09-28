import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { rule_schema } from './schema';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'rule', schema: rule_schema },
    ]),
  ],
  controllers: [RuleController],
  providers: [RuleService],
  exports: [RuleService],
})
export class RulesModule {}
