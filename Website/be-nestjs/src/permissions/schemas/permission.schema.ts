
    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import mongoose, { HydratedDocument } from 'mongoose';

    export type PermissionDocument = HydratedDocument<Permission>;

    @Schema({ timestamps: true })
    export class Permission {
        @Prop()
        name: string;

        @Prop()
        path: string;

        @Prop({emun : ["GET", "POST", "PUT", "DELETE"]})
        method: string;

        @Prop()
        module: string;

        @Prop({ type: Object })
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            name: string;
        }
        
        @Prop({ type: Object })
        createdBy: {
            _id: mongoose.Schema.Types.ObjectId;
            name: string;
        }


        @Prop({ type: Object })
        deletedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            name: string;
        }

        @Prop()
        createdAt: Date;

        @Prop()
        updatedAt: Date;

        @Prop()
        isDeleted: boolean;
    }

    export const PermissionSchema = SchemaFactory.createForClass(Permission);
