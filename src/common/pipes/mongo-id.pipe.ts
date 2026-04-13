import { PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export class MongoIdPipe implements PipeTransform { //Validate MongoDB ID and Prevent invalid IDs
  transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid MongoDB ID');
    }
    return value;
  }
}