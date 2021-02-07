import { Product } from "./product.model";

export interface Category {
  [x: string]: any;
  id: string;
  mainCategoryId: string;
  name: string;
  products: any
}
