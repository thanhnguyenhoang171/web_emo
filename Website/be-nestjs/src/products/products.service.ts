import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument, Product } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: SoftDeleteModel<ProductDocument>
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const {
      name, type, price, description, isActive, image
    } = createProductDto;

    let newProduct = await this.ProductModel.create({
      name, type, price, description, isActive,image,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: newProduct?._id,
      createdAt: newProduct?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.ProductModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.ProductModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found Product`;

    return await this.ProductModel.findById(id);
  }

  async update(_id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const updated = await this.ProductModel.updateOne(
      { _id },
      {
        ...updateProductDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return `not found Product`;

    await this.ProductModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.ProductModel.softDelete({
      _id
    })
  }
}
