import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  // @Permissions(Permission.MANAGE_CATEGORIES)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get('courses/:topic_id')
  findAllCourses(@Param('topic_id') topic_id: string){
    return this.topicsService.findAllCourses(topic_id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.MANAGE_CATEGORIES)
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @Permissions(Permission.MANAGE_CATEGORIES)
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
