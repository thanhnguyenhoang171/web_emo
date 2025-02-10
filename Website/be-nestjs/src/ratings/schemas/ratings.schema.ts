import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Type } from 'src/types/schemas/type.schema'
import { Product } from 'src/products/schemas/products.schema';

export type RatingDocument = HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating {


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Type.name })
    typeId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    productId: mongoose.Schema.Types.ObjectId;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;


    @Prop()
    comment: string;



    @Prop() // Image feedback from customers
    url: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    detectedEmotion: {
        class: string;
        confidenceScore: number;
        
    }[]

    @Prop({ type: mongoose.Schema.Types.Array })
    commentEmotionAnalysis: {
        class: string;
    }[]

    @Prop()
    status: string;

    @Prop()
    isPositive: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        };
    }[]

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);