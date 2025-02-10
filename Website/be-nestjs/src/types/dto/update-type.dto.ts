import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTypeDto {
    @IsOptional() // Không bắt buộc phải truyền khi update
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    logo: string;
}
