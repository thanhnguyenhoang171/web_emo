import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PermissionDocument } from './schemas/permission.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectModel('Permission') private readonly permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, path, method, module } = createPermissionDto;

    const isExist = await this.permissionModel.findOne({ path, method });
    if (isExist)
    {
      throw new BadRequestException(`Permission với apiPath=${path} , method=${method} đã tồn tại!`)
    }

    let newPermission = await this.permissionModel.create({
      name,
      path,
      method,
      module,
      createdBy: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt
    };

  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { sort, filter, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    // Define offset and default limit
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    // Calc total items and pages
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }


  // Function check exist permission
  async checkExistPermission(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("ID không hợp lệ!");
    }
    const user = await this.permissionModel.findOne({ _id });
    if (!user) {
      throw new NotFoundException("Permission này không tồn tại!");
    }
    return user;
  }

  async findOne(_id: string) {
    try {
      return await this.checkExistPermission(_id);

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Lỗi máy chủ nội bộ");
    }
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    try {
      await this.checkExistPermission(_id);
      const { name, path, method, module } = updatePermissionDto;
      const updatedPermission = await this.permissionModel.updateOne({ _id }, {
        name, path, module, method, updatedBy: {
          _id: user._id,
          email: user.email,
          name: user.name
        }
      })
      return updatedPermission;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException("Lỗi máy chủ nội bộ");
    }
  }

  async remove(_id: string, user: IUser) {
    try {
      await this.checkExistPermission(_id);
      const result = await this.permissionModel.softDelete({ _id });
      await this.permissionModel.updateOne({ _id }, {
        deletedBy: {
          _id: user._id,
          email: user.email,
          name: user.name
        }
      })
      return result;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Lỗi máy chủ nội bộ")
    }
  }
}
