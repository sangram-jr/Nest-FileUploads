import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type CollectionDocument = HydratedDocument<Collection>;

@Schema()
export class Collection {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop({type:Types.ObjectId , ref:'User' , required:true})
  userId!:Types.ObjectId
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
