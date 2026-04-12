import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type UploadDocument = HydratedDocument<Upload>;

@Schema()
export class Upload {
  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  public_id!: string;

  @Prop()
  fileName!: string;

  @Prop()
  format!: string;

  @Prop({ type: Types.ObjectId, ref: 'Collection', required: true })
  collectionId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);