import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('upload')
export class UploadController {

    @Post()
    @UseInterceptors(FileInterceptor('file'))//file->fieldname  , inside postman,inside body,form-data-> select File key=file  value=chose file from folder
    uploadFile(@UploadedFile() file: Express.Multer.File){
        console.log(file);
    }
}
