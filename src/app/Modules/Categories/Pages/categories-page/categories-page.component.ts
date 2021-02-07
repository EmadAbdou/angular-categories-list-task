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


  // Add Main Category

  openAddCategoryModal(content) {
    this.modalService.open(content).result.then((result) => {
      this.newCategory.id = uuid();
      this.addNewCategory(this.newCategory);
    }, (reason) => {
      // console.log('reson');
      // console.log(reason);
    });
  }


  addNewCategory(categoryData) {
    this.categoriesService.addMainCategory(categoryData).subscribe((result: MainCategory) => {
      if (result) {
        this.newCategory.name = '';
        this.getCategoriesData();
      }
    })
  }

  // Add Subcategory

  openAddSubCategoryModal(content, categoryId) {
    this.modalService.open(content).result.then((result) => {
      this.newSubCategory.id = uuid();
      this.newSubCategory.mainCategoryId = categoryId;
      this.addNewSubCategory(this.newSubCategory);
    }, (reason) => {
      // console.log('reson');
      // console.log(reason);
    });
  }

  addNewSubCategory(subCategoryData) {
    this.categoriesService.addSubCategory(subCategoryData).subscribe((result: Category) => {
      console.log(result);
      if (result) {
        this.newSubCategory.name = '';
        this.getCategoriesData();
      }
    })
  }

  // Open Category Details

  openCategoryPage(categoryId) {
    this.router.navigateByUrl(`categories/category/${categoryId}`);
  }


  ngOnDestroy() {
    if (this.categoriesSub) {
      this.categoriesSub.unsubscribe();
    }
  }

}
