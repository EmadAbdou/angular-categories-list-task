import { MainCategory } from './../interfaces/mainCategory.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Category } from '../interfaces/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllCategories() {
    return this.http.get<MainCategory[]>(`${this.apiUrl}/category`).pipe(
      delay(500)
    );
  }

  addMainCategory(mainCategory: MainCategory) {
    return this.http.post(`${this.apiUrl}/category`, mainCategory).pipe(
      delay(500)
    );
  }

  addSubCategory(subCategory) {
    return this.http.post(`${this.apiUrl}/subCategories`, subCategory).pipe(
      delay(500)
    );
  }

  getSubCategory(categoryId) {
    return this.http.get<Category>(`${this.apiUrl}/subCategories?mainCategoryId=${categoryId}`).pipe(
      delay(500)
    );
  }

  getSubCategoryDetails(categoryId) {
    return this.http.get<Category>(`${this.apiUrl}/subCategories?id=${categoryId}`).pipe(
      delay(500)
    );
  }




}
