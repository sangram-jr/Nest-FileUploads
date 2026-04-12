import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
//import cloudinary from 'src/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
    constructor(private readonly configService:ConfigService){
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
}
