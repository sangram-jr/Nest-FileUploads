import { Controller, Delete, Get, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';


@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService:UploadService){}

    @UseGuards(AuthGuard)
    @Post(':collectionId')
    @UseInterceptors(FileInterceptor('file'))//file->fieldname  , inside postman,inside body,form-data-> select File key=file  value=chose file from folder
    @UseInterceptors(LoggingInterceptor)
    async uploadFile(
        @Param('collectionId',MongoIdPipe) collectionId: string,
        @UploadedFile(
            //in built file-validator(pipe)
            new ParseFilePipe({
                validators:[
                    //new MaxFileSizeValidator({maxSize:1000*2}),//1000 bytes=1kb
                    //new FileTypeValidator({fileType:'application/pdf'})//we can add image/jpeg
                ]
            })
        ) 
        file: Express.Multer.File,
        @GetUser('sub') userId:string,
    ){
            //main logic in uploadFile method
            //console.log(file);
            const result=await this.uploadService.uploadFile(file);
            //console.log(result);

            return this.uploadService.saveFile({
                url:result.secure_url,
                public_id:result.public_id,
                format:result.format,
                collectionId:collectionId,
                userId:userId,

            });
    }


    @UseGuards(AuthGuard)
    @Get(':collectionId')
    getFiles(
        @Param('collectionId',MongoIdPipe) collectionId: string,
        @GetUser('sub') userId:string,
    ){
        //const userId=req.user.sub;
        return this.uploadService.getFiles(collectionId,userId);
    }
    

    @UseGuards(AuthGuard)
    @UseInterceptors(LoggingInterceptor)
    @Delete(':fileId')
    remove(@Param('fileId',MongoIdPipe) fileId: string, @GetUser('sub') userId:string) {
        //const userId=req.user.sub;
        return this.uploadService.deleteFile(fileId, userId);
    }
    
}
