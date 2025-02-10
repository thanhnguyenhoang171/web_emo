import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

//data transfer object // class = { }

class Types {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}

export class CreateProductDto {

    @IsNotEmpty({ message: 'Tên không được để trống', })
    name: string;


    @IsNotEmpty({ message: 'description không được để trống', })
    description: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Types)
    type: Types;


    @IsNotEmpty({ message: 'Giá không được để trống', })
    price: number;

    @IsNotEmpty({ message: 'Ảnh không được để trống', })
    image: string;

    @IsNotEmpty({ message: 'Trạng thái không được để trống', })
    isActive: string;


}



