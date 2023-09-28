import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { CreateRoleDTO } from './dto';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  //ADD NEW ROLE TO DB
  @Post()
  @Permissions(Permission.MANAGE_ROLES)
  create(@Body() roleDTO: CreateRoleDTO) {
    return this.rolesService.create(roleDTO);
  }

  //GET ALL NON-BLOCKED ROLES
  @Get()
  @Permissions(Permission.MANAGE_ROLES)
  findAll() {
    return this.rolesService.findAll();
  }

  //GET A NON-BLOCKED ROLE
  @Get(':role_id')
  @Permissions(Permission.MANAGE_ROLES)
  findOne(@Param('role_id') role_id: string) {
    return this.rolesService.findOne(role_id);
  }

  //EDIT A ROLE
  @Patch(':role_id')
  @Permissions(Permission.MANAGE_ROLES)
  update(@Param('role_id') role_id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(role_id, updateRoleDto);
  }

  //DELETE A PERMISSION FROM A ROLE
  @Delete()
  @Permissions(Permission.MANAGE_ROLES)
  removeRolePermission(
    @Query() query: { role_id: string; permissionId: string },
  ) {
    return this.rolesService.removeRolePermission(query);
  }

  //DELETE A ROLE
  @Delete(':role_id')
  @Permissions(Permission.MANAGE_ROLES)
  remove(@Param('role_id') role_id: string) {
    return this.rolesService.remove(role_id);
  }
}
