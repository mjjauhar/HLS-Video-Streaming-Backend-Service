import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDTO } from './dto';
import { role } from './types';
import { UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel('role') private roleModel: Model<role>) { }

  //CREATE A NEW ROLE
  async create(roleDTO: CreateRoleDTO) {
    const { name } = roleDTO;
    const role = await this.roleModel.findOne({ name });
    if (role) {
      throw new HttpException('Role already exist', HttpStatus.BAD_REQUEST);
    }
    const createdRole = new this.roleModel(roleDTO);
    await createdRole.save();
    return createdRole;
  }

  //GET ALL NON-BLOCKED ROLES
  async findAll() {
    const all_roles = await this.roleModel.find({ status: 2 });
    return all_roles;
  }

  //GET A NON-BLOCKED ROLE
  async findOne(id: string) {
    const role = await this.roleModel.findOne({ _id: id, status: 2 });
    return role;
  }

  //UPDATE A ROLE
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleModel.updateOne(
      { _id: id },
      {
        $set: {
          name: updateRoleDto.name,
          description: updateRoleDto.description,
          updated_at: Date.now(),
        },
        $addToSet: {
          permissions: updateRoleDto.permissions,
        },
      },
      { upsert: true },
    );
    return updatedRole;
  }

  //DELETE A PERMISSION FROM A ROLE
  async removeRolePermission(query: { role_id: string; permissionId: string }) {
    if (!query.role_id || !query.permissionId) {
      throw new HttpException(
        'Required query data (roleId or permissionId) is missing',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const removedRolePermission = this.roleModel.updateOne(
      { _id: query.role_id },
      {
        $pullAll: {
          permissions: [query.permissionId],
        },
      },
    );
    return removedRolePermission;
  }

  //DELETE A ROLE
  async remove(id: string) {
    const deletedRole = await this.roleModel.deleteOne({ _id: id });
    return deletedRole;
  }
}
