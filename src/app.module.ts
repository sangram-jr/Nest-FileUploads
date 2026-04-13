import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionModule } from './collection/collection.module';



@Module({
  imports: [
    UploadModule,
    //load .env
    ConfigModule.forRoot({isGlobal:true}),
    //mongodb connection
    MongooseModule.forRoot(process.env.MONGODB_URL!),
    AuthModule,
    UserModule,
    CollectionModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
