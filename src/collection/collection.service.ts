import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from './schemas/collection.schema';
import { Model } from 'mongoose';

@Injectable()
export class CollectionService {
  // Once the schema is created,inject a User model into the userService using the @InjectModel() decorator
  constructor(@InjectModel(Collection.name) private collectionModel: Model<Collection>) {}

  async create(userId:string,createCollectionDto: CreateCollectionDto) {
    const collection=await this.collectionModel.create({
      ...createCollectionDto,
      userId:userId
    });
    return{
      message:"Collection Created Successfully",
      collection:collection
    }
  }

  async findAll(userId:string) {
    return await this.collectionModel.find({ 
      userId:userId 
    }).sort({ createdAt: -1 });
  }

  /*findOne(id: number) {
    return `This action returns a #${id} collection`;
  }*/

  async update(collectionId: string,userId:string, updateCollectionDto: UpdateCollectionDto) {
    const updatedCollection = await this.collectionModel.findOneAndUpdate(
      { _id: collectionId, userId:userId }, //security (only owner can update)
      updateCollectionDto,
      { returnDocument: 'after' },
    );

    if (!updatedCollection) throw new NotFoundException('Collection not found');

    return {
      message:"Collection Updated Successfully",
      updatedCollection:updatedCollection
    };
  }

  async remove(collectionId: string,userId: string) {
    const deletedCollection = await this.collectionModel.findOneAndDelete({
      _id: collectionId,
      userId:userId,
    });

    if (!deletedCollection) throw new NotFoundException('Collection not found');

    return { 
      message: 'Collection deleted' ,
      deletedCollection:deletedCollection
    };
  }
}
