import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/auth/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcryptjs';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private jwtService: JwtService
    ){}

    async registerUser(registerUserDto:RegisterDto){
        //register logic

        //console.log("register user:", registerUserDto);

        //hash the pass
        const salt=10;
        const hash=await bcrypt.hash(registerUserDto.password,salt);

        //Take all properties from registerUserDto and then override/add password
        const user=await this.userService.createUser({...registerUserDto,password:hash});
        //console.log('user:',user);

        //generate jwt token 
        //todo: remove role admin from here . only for test
        const payload={ sub: user._id};
        const token=await this.jwtService.signAsync(payload);
        return {access_token:token};    
    }
    async loginUser(loginUserDto:LoginDto){
        const user=await this.userService.compareEmail(loginUserDto.email);
        if(!user){
            throw new UnauthorizedException("Invalid Email or Password")
        }
        //compare password
        const isMatch=await bcrypt.compare(loginUserDto.password,user.password);
        if(!isMatch){
            throw new UnauthorizedException("Invalid Email or Password");
        }

        //generate jwt token 
        
        const payload={ sub: user._id};
        const token=await this.jwtService.signAsync(payload);
        return {access_token:token}; 
       
    }
}
