import { Product } from './../interfaces/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProducts(page) {
    return this.http.get<Product[]>(`${this.apiUrl}/products?_page=${page}&_limit=4`, { observe: 'response' }).pipe(
      delay(500)
    );
  }

  addCategoryProduct(categoryProduct) {
    return this.http.post(`${this.apiUrl}/products`, categoryProduct).pipe(
      delay(500)
    );
  }

  editCategoryProduct(productId, product) {
    return this.http.put(`${this.apiUrl}/products/${productId}`, product).pipe(
      delay(500)
    );
  }

  deleteCategoryProduct(productId) {
    return this.http.delete(`${this.apiUrl}/products/${productId}`).pipe(
      delay(500)
    );
  }


}
