import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  async addProducts(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
    @Body('owner') owner: string,
  ) {
    const generatedId = await this.productsService.insertProducts(
      prodTitle,
      prodDesc,
      prodPrice,
      owner,
    );
    return { id: generatedId };
  }
  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return this.productsService.findOne(productId);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updatedProduct: Product,
  ) {
    return await this.productsService.updateProduct(productId, updatedProduct);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
