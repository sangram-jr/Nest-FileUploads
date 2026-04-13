import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';

@Injectable()
export class UserService {
    // Once the schema is created,inject a User model into the userService using the @InjectModel() decorator
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(registerUserDto:RegisterDto){
        try {
           return await this.userModel.create({
                username:registerUserDto.username,
                email:registerUserDto.email,
                password:registerUserDto.password
            }); 
        } catch (error) {
            //error as an object that MAY have a code property of type number
            const e= error as {code?:number};
            const DUPLICATE_KEY_CODE=11000;
            if(e.code===DUPLICATE_KEY_CODE){
                throw new ConflictException('Email Already Exist!')
            }
            throw error;
        }
        
    }
    //find email from userModel schema
    async compareEmail(email:string){
        return await this.userModel.findOne({email:email});  
    }
    
    //get user from userModel schema
    async getUserById(id:string){
        return await this.userModel.findOne({_id:id});
    }
}
