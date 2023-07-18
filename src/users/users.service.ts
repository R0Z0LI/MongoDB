import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async insertUsers(name: string, email: string, password: string) {
    const newUser = new this.userModel({
      name: name,
      email: email,
      password: password,
    });
    const result = await newUser.save();
    return result.id as string;
  }

  async findAll() {
    const users = await this.userModel.find().populate('product', '_id').exec();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      product: user.product?._id,
    }));
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).populate('product', '_id').exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }

  private async findUserById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel
        .findById(id)
        .populate('product', '_id')
        .exec();
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updatedUser: User) {
    let user = await this.findUserById(id);
    if (updatedUser.name) {
      user.name = updatedUser.name;
    }
    if (updatedUser.email) {
      user.email = updatedUser.email;
    }
    if (updatedUser.password) {
      user.password = updatedUser.password;
    }
    try {
      const updated = await user.updateOne(user);
      return updated;
    } catch (err) {
      console.log(err);
    }
  }
}
