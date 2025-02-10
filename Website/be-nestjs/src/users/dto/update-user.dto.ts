import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
    @IsOptional()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Role không được để trống', })
    @IsMongoId({ message: 'Role có định dạng là mongo id', })
    role: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    isActive: boolean;
}
