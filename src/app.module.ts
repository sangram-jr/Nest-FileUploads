import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
//import { CollectionModule } from './modules/collection/collection.module';
import { UploadModule } from './modules/upload/upload.module';
import { CollectionModule } from './modules/collection/collection.module';
import configuration from './config';


@Module({
  imports: [
    UploadModule,
    //load config
    ConfigModule.forRoot({
      isGlobal:true,
      load:configuration // configuration comes from->src/config/index.ts
    }),
    //mongodb connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    
    AuthModule,
    UserModule,
    CollectionModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
