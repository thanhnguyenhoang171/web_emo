import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRatingDto {
    @IsNotEmpty({ message: 'ảnh feedback chưa được tải lên', })
    url: string;

    @IsNotEmpty({ message: 'Chưa nhận xét sản phẩm', })
    comment: string;

    @Prop()
    status: string;

    @Prop({ type: mongoose.Schema.Types.Array })
      detectedEmotion: {
          class: string;
          confidenceScore: number;
          
      }[]
  

    @Prop()
    // @IsNotEmpty({ message: 'typeId không được để trống', })
    typeId: mongoose.Schema.Types.ObjectId;

    @Prop()
    // @IsNotEmpty({ message: 'productId không được để trống', })
    productId: mongoose.Schema.Types.ObjectId;
}
