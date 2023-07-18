import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product, ProductDocument } from './product.model';
import { User } from '../users/users.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async insertProducts(
    title: string,
    desc: string,
    price: number,
    owner: string,
  ) {
    const ownerExists = await this.userModel.find({ _id: owner });
    if (!ownerExists) {
      throw new NotFoundException('Owner not found');
    }
    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price,
      owner: owner,
    });
    const result = await this.productModel.create(newProduct);
    return result.id as string;
  }

  async findAll() {
    const products = await this.productModel
      .find()
      .populate('owner', '_id')
      .exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
      userId: prod.owner?._id,
    }));
  }

  async findOne(id: string) {
    return await this.productModel.findById(id);
  }

  private async findProductById(id: string): Promise<Product> {
    let product: Product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(productId: string, updatedProduct: Product) {
    let product = await this.findProductById(productId);
    console.log(productId);
    if (updatedProduct.title) {
      product.title = updatedProduct.title;
    }
    if (updatedProduct.description) {
      product.description = updatedProduct.description;
    }
    if (updatedProduct.price) {
      product.price = updatedProduct.price;
    }
    console.log(product);
    console.log(product.title);
    try {
      const updated = await product.updateOne(product);
      return updated.title;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productModel.deleteOne({ _id: id });
  }
}
