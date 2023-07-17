import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async insertProducts(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price,
    });
    const result = await this.productModel.create(newProduct);
    return result.id as string;
  }

  async findAll() {
    const products = await this.productModel.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
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
}
