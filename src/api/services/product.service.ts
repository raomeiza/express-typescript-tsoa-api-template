import Product from '../models/product.model';
import IProduct from '../interfaces/product.interface';


interface IProductService {
  create(resource: IProduct): Promise<any>;
  update(id: string, resource: IProduct): Promise<any>;
  delete(id: string): Promise<any>;
  get(id: string): Promise<any>;
  getAll(): Promise<any>;
  getProductsByCategory(category: string): Promise<any>;
  getProductsByCharacteristics(
    characteristics: 'brand' | 'price' | 'discount' | 'rating' | 'category',
    value: string
    ): Promise<any>;
}

class ProductService implements IProductService {
  async create(resource: IProduct) {
    try {
      return await Product.create(resource);
    } catch (err: any) {
            throw ({ message: err.message || 'Failed to create product', error: err, status: err.status || err.errorStatus || 401 })

    }
  }

  async update(id: string, resource: IProduct) {
    try {
      return await Product.findByIdAndUpdate(id, resource, { new: true })
        .orFail(new Error('Product not found'))
    } catch (err: any) {
            throw ({ message: err.message || 'failed to update product', error: err, status: err.status || err.errorStatus || 401 })

    }
  }

  async delete(id: string) {
    try {
      return await Product.findByIdAndDelete(id).orFail(new Error('Product not found'));
    } catch (err: any) {
            throw ({ message: err.message || 'failed to delete product', error: err, status: err.status || err.errorStatus || 404 })

    }
  }

  async get(id: string) {
    try {
      return await Product.findById(id).orFail(new Error('Product not found'));
    } catch (err: any) {
            throw ({ message: err.message || 'Product not found', error: err, status: err.status || err.errorStatus || 404 })

    }
  }

  async getAll() {
    try {
      return await Product.find();
    } catch (err: any) {
            throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })

    }
  } 

  async getProductsByCategory(category: string) {
    try {
     return await Product.find({ $where: `this.category == ${category}` }).orFail(new Error('No products found for this category'));
    } catch (err: any) {
            throw ({ message: err.message || 'Product not found', error: err, status: err.status || err.errorStatus || 404 })

    }
      
  }

  async getProductsByCharacteristics(characteristics: 'brand' | 'price' | 'discount' | 'rating' | 'category', value: string) {

    try {
      return await Product.find({ $where: `this.${characteristics} == ${value}` }).orFail(new Error('No products found for this category'));
    }
    catch (err: any) {
            throw ({ message: err.message || 'User not found', error: err, status: err.status || err.errorStatus || 404 })

    }
  }
}

export default new ProductService();