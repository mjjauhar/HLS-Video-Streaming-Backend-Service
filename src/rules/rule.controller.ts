import {
    Controller,
    Post,
    Body,
    Patch,
    Get,
    Param,
} from '@nestjs/common';
import { CreateRuleDto , UpdateRuleDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import { RuleService } from './rule.service';

@Controller('rules')
export class RuleController {
    constructor(private readonly ruleService: RuleService) { }

    //GET ALL RULES
    @Get()
    @Permissions(Permission.MANAGE_COURSES)
    findAll() {
        return this.ruleService.findAll();
    }

    //GET A RULE
    @Get(':rule_id')
    @Permissions(Permission.MANAGE_COURSES)
    findOne(@Param('rule_id') rule_id: string) {
        return this.ruleService.findOne(rule_id);
    }

    //EDIT A RULE
    @Patch(':rule_id')
    @Permissions(Permission.MANAGE_COURSES)
    updateCourseRule(@Body() updateRuleDto: UpdateRuleDto, @Param('rule_id') rule_id: string) {
        return this.ruleService.updateRule(updateRuleDto, rule_id);
    }

    //ADD NEW RULE
    @Post()
    @Permissions(Permission.MANAGE_COURSES)
    createCourseRule(@Body() createRuleDto: CreateRuleDto) {
        return this.ruleService.createRule(createRuleDto);
    }

    //DELETE A RULE
    @Get(':rule_id')
    @Permissions(Permission.MANAGE_COURSES)
    delete(@Param('rule_id') rule_id: string) {
        return this.ruleService.delete(rule_id);
    }
}
