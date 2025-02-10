import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';
export class CreateUserDto {
    @IsString({ message: 'Tên phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsString({ message: 'Mật khẩu phải là chuỗi' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;


    @IsNotEmpty({ message: 'Role không được để trống', })
    @IsMongoId({ message: 'Role có định dạng là mongo id', })
    role: mongoose.Schema.Types.ObjectId;

}

export class RegisterUserDto {
    @IsString({ message: 'Tên phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsString({ message: 'Mật khẩu phải là chuỗi' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

}