import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async insertUsers(name: string, email: string, password: string) {
    const newUser = new this.userModel({
      name: name,
      email: email,
      password: password,
    });
    const result = await newUser.save();
    return result.id as string;
  }
}
