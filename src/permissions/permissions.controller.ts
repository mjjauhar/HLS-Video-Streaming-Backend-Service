import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto';
import { UpdatePermissionDto } from './dto';
import { Roles } from 'src/roles/decorators';
import { Role } from 'src/roles/entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  //CREATE A NEW PERMISSION
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  //GET ALL NON-BLOCKED PERMISSIONS
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.permissionsService.findAll();
  }

  //GET A NON-BLOCKED PERMISSION
  @Get(':permission_id')
  @Roles(Role.ADMIN)
  findOne(@Param('permission_id') permission_id: string) {
    return this.permissionsService.findOne(permission_id);
  }

  //EDIT A PERMISSION
  @Patch(':permission_id')
  @Roles(Role.ADMIN)
  update(
    @Param('permission_id') permission_id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(permission_id, updatePermissionDto);
  }

  //DELETE A PERMISSION
  @Delete(':permission_id')
  @Roles(Role.ADMIN)
  remove(@Param('permission_id') permission_id: string) {
    return this.permissionsService.remove(permission_id);
  }
}
