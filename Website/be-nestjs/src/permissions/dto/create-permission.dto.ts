import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {

    @IsString({ message: 'Mô tả phải là một chuỗi' })
    module: string;

    @IsString({ message: 'Tên phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsString({ message: "path phải là một chuỗi" })
    path: string;

    @IsString({ message: "Method phải là một chuỗi" })
    @IsNotEmpty({ message: "Method không được để trống" })
    @IsEnum(['GET', 'POST', 'PUT', 'DELETE'], { message: "Method phải là GET, POST, PUT, DELETE" })
    method: string;
    
}
