import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
//import cloudinary from 'src/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';
import { Upload } from './schemas/upload.schema';
import { Model } from 'mongoose';

@Injectable()
export class UploadService {
    constructor(
        private readonly configService:ConfigService,
        @InjectModel(Upload.name) private uploadModel: Model<Upload>
    ){
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUD_NAME'),
            api_key: this.configService.get<string>('API_KEY'),
            api_secret: this.configService.get<string>('API_SECRET'),
        });
        //console.log('Cloud Name:', this.configService.get('CLOUD_NAME'));
        //console.log('API Key:', this.configService.get('API_KEY'));
        //console.log('API secret:', this.configService.get('API_SECRET'));

    }
    
    
    async uploadFile(file:Express.Multer.File):Promise<UploadApiResponse>{
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream(
                {
                    // resource_type: 'auto', // auto detects image/pdf/video
                    resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
                    format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
                    folder: 'nestjs_uploads',
                },
                (error?:UploadApiErrorResponse,result?:UploadApiResponse)=>{
                    if (error) {
                        return reject(new Error(error.message));
                    }
                    if (!result) {
                        return reject(new Error('Upload failed'));
                    }
                    resolve(result);
                },
            ).end(file.buffer)
        });
        
    }

    async saveFile(data:any){
        const uploadedFile= await this.uploadModel.create(data);
        return{
            message:"File Uploaded Successfully",
            uploadedFile:uploadedFile
        }
    }

    async getFiles(collectionId: string, userId: string) {
        return await this.uploadModel.find({
            collectionId:collectionId,
            userId:userId
        })
    }

    async deleteFile(fileId: string, userId: string) {
        const file = await this.uploadModel.findOne({
            _id: fileId,
            userId:userId,
        });

        if (!file) throw new NotFoundException('File not found');

        // delete from cloudinary
        await cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.format === 'pdf' ? 'raw' : 'image',
        });

        // delete from DB
        await this.uploadModel.deleteOne({ _id: fileId });

        return { message: 'File deleted' };
    }
}
