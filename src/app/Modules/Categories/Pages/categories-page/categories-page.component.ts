import { Category } from './../../../../Core/interfaces/category.model';
import { MainCategory } from './../../../../Core/interfaces/mainCategory.model';
import { CategoriesService } from './../../../../Core/Services/categories.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuid } from 'uuid';
import { map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {

  mainCategoriesData: MainCategory[];
  categoriesSub: Subscription;
  mainCategoriesLoader = true;

  newCategory: MainCategory = {
    id: '',
    name: '',
    subCategories: ''
  }

  newSubCategory: Category = {
    id: '',
    mainCategoryId: '',
    name: '',
  }

  constructor(
    private categoriesService: CategoriesService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategoriesData();
  }

  // Get Main Categories With Subcategories
  // It's little complex due to json server file structure

  getCategoriesData() {
    this.mainCategoriesLoader = true;
    this.categoriesSub = this.categoriesService.getAllCategories().pipe(
      mergeMap(categories => forkJoin(categories.map((category) => this.categoriesService.getSubCategory(category.id)
        .pipe(map(subCategories => {
          console.log(subCategories);
          console.log('sxxx')
          category['subCategories'] = subCategories.filter(subCategory => subCategory.mainCategoryId == category.id);
          console.log(subCategories);
          console.log('sss');
          return category;
        }))
      )))
    ).subscribe((res: MainCategory[]) => {
      this.mainCategoriesLoader = false;
      this.mainCategoriesData = res;
    })
  }


  // Add Main Category Modal

  openAddCategoryModal(content) {
    this.modalService.open(content).result.then((result) => {
      this.newCategory.id = uuid();
      this.addNewCategory(this.newCategory);
    }, (reason) => {
      // Handle Error Here
    });
  }

  // Add Main Category Function

  addNewCategory(categoryData) {
    this.categoriesService.addMainCategory(categoryData).subscribe((result: MainCategory) => {
      if (result) {
        this.newCategory.name = '';
        this.getCategoriesData();
      }
    })
  }

  // Add Subcategory Modal

  openAddSubCategoryModal(content, categoryId) {
    this.modalService.open(content).result.then((result) => {
      this.newSubCategory.id = uuid();
      this.newSubCategory.mainCategoryId = categoryId;
      this.addNewSubCategory(this.newSubCategory);
    }, (reason) => {
      // Handle Error Here
    });
  }

    // Add Sub Category Function

  addNewSubCategory(subCategoryData) {
    this.categoriesService.addSubCategory(subCategoryData).subscribe((result: Category) => {
      console.log(result);
      if (result) {
        this.newSubCategory.name = '';
        this.getCategoriesData();
      }
    })
  }

  // Open Category Details Page

  openCategoryPage(categoryId) {
    this.router.navigateByUrl(`categories/category/${categoryId}`);
  }


  ngOnDestroy() {
    if (this.categoriesSub) {
      this.categoriesSub.unsubscribe();
    }
  }

}
