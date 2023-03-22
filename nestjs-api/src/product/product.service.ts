import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';

const products: Product[] = [
  Object.assign(new Product(), {
    pid: 1,
    name: 'Table',
    price: 899.99,
  }),
  Object.assign(new Product(), {
    pid: 2,
    name: 'Couch',
    price: 1299.0,
  }),
];

const purchases: Record<number, number[]> = {
  1: [1],
};

@Injectable()
export class ProductService {
  async getPurchases(uid: number): Promise<Product[]> {
    const pids = purchases[uid];
    if (!pids) {
      return [];
    }

    return pids.map(pid => products.find(product => product.pid === pid));
  }

  async buyProduct(uid: number, pid: number): Promise<Product> {
    const product = products.find(product => product.pid === pid);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!purchases[uid]) {
      purchases[uid] = [];
    }

    purchases[uid].push(pid);
    return product;
  }
}
