import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from './schemas/upload.schema';
import { AuthModule } from 'src/auth/auth.module';
//import { AuthModule } from 'src/auth/auth.module';
//import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),AuthModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
