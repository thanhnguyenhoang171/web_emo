import { IsArray, IsBoolean, IsIn, IsMongoId, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Miêu tả không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Trạng thái hoạt động không được để trống" })
    @IsBoolean({ message: "Trạng thái hoạt động phải có giá trị boolean" })
    isActive: boolean;

    @IsNotEmpty({ message: "Quyền hạn không được để trống" })
    @IsMongoId({ each: true, message: "Mỗi quyền hạn phải là MongoObjectID" })
    @IsArray({ message: "Quyền hạn có định dạng là một mảng" })
    permissions: mongoose.Schema.Types.ObjectId[];
}
