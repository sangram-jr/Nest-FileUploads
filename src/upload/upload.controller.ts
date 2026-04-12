import { Controller, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';


@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService:UploadService){}

    @Post()
    @UseInterceptors(FileInterceptor('file'))//file->fieldname  , inside postman,inside body,form-data-> select File key=file  value=chose file from folder
    async uploadFile(@UploadedFile(
        //in built file-validator(pipe)
        new ParseFilePipe({
            validators:[
                //new MaxFileSizeValidator({maxSize:1000*2}),//1000 bytes=1kb
                //new FileTypeValidator({fileType:'application/pdf'})//we can add image/jpeg
            ]
        })
        ) 
        file: Express.Multer.File){
            //main logic in uploadFile method
            //console.log(file);
            const result=await this.uploadService.uploadFile(file);
            //console.log(result);
            return{
                message:"File Uploaded Successfull",
                url:result.secure_url,
                resource_type:result.resource_type,
                created_at:result.created_at
            };
    }
}
