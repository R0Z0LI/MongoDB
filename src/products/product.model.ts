import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({});

export class Product {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public price: number,
  ) {}
}
