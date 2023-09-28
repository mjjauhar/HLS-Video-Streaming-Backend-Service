import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto';
import { UpdatePermissionDto } from './dto';
import { permission } from './types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel('permission') private permissionModel: Model<permission>,
  ) { }

  //CREATE A NEW PERMISSION
  async create(createPermissionDto: CreatePermissionDto) {
    const { name } = createPermissionDto;
    const permission = await this.permissionModel.findOne({ name });
    if (permission) {
      throw new HttpException(
        'Permission already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdPermission = new this.permissionModel(createPermissionDto);
    await createdPermission.save();
    return createdPermission;
  }

  //GET ALL NON-BLOCKED PERMISSIONS
  async findAll() {
    const all_permissions = await this.permissionModel.find({ status: 2 });
    return all_permissions;
  }

  //GET A NON-BLOCKED PERMISSION
  async findOne(id: string) {
    const permission = await this.permissionModel.findOne({ _id: id, status: 2 });
    return permission;
  }

  //EDIT A PERMISSION
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const updatedPermission = await this.permissionModel.updateOne(
      { _id: id },
      {
        $set: {
          name: updatePermissionDto.name,
          description: updatePermissionDto.description,
          updated_at: Date.now(),
        },
      },
    );
    return updatedPermission;
  }

  //DELETE A PERMISSION
  async remove(id: string) {
    const deletedPermission = await this.permissionModel.deleteOne({ _id: id });
    return deletedPermission;
  }
}
