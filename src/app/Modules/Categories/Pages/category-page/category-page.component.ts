import { map } from 'rxjs/operators';
import { Product } from './../../../../Core/interfaces/product.model';
import { Category } from './../../../../Core/interfaces/category.model';
import { ProductService } from './../../../../Core/Services/product.service';
import { CategoriesService } from './../../../../Core/Services/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit, OnDestroy {

  categoryId;
  categoryData: Category;
  productsLoader = true;
  categoryProducts: Product[];
  product: Product = {
    id: '',
    name: '',
    code: '',
    price: '',
    subCategoryId: ''
  }
  selectedProductsIds = [];
  page = 1;
  pageSize = 4;
  productsSize;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private modalService: NgbModal
  ) {
    this.route.paramMap.subscribe(res => {
      this.categoryId = res['params'].id;
      this.getCategoryData(this.categoryId);
    })
  }

  ngOnInit(): void {
  }

  getCategoryData(categoryId) {
    this.categoriesService.getSubCategoryDetails(categoryId).subscribe((category: Category) => {
      if (category) {
        this.categoryData = category;
        console.log(this.categoryData[0].name)
        this.getCategoryProducts(this.page);
      }
    })
  }

  openAddProductModal(content) {
    this.modalService.open(content).result.then((result) => {
      this.product.id = uuid();
      this.product.subCategoryId = this.categoryId;
      this.addNewProduct(this.product);
    }, (reason) => {
      // console.log('reson');
      // console.log(reason);
    });
  }

  getCategoryProducts(page) {
    console.log(page);
    this.productsLoader = true;
    this.productService.getProducts(page).pipe(
      map(res => {
        let products = res.body;
        this.productsSize = res.headers.get('X-Total-Count');
        products = products.filter(product => product.subCategoryId == this.categoryId);
        return products;
      })
    ).subscribe((result: Product[]) => {
      if (result) {
        this.categoryProducts = result;
        console.log(this.categoryProducts);
        // this.productsSize = this.categoryProducts.length;
        this.productsLoader = false;
      }

    })
  }

  addNewProduct(productData) {
    this.productService.addCategoryProduct(productData).subscribe((result: Product) => {
      if (result) {
        this.product = {
          id: '',
          name: '',
          code: '',
          price: '',
          subCategoryId: ''
        };
        this.getCategoryProducts(this.page);
      }
    })
  }

  openEditProductModal(content, product) {
    this.product.name = product.name;
    this.product.code = product.code;
    this.product.price = product.price;
    this.product.subCategoryId = product.subCategoryId;
    this.modalService.open(content).result.then((result) => {
      this.editProduct( product.id, this.product);
    }, (reason) => {
      // console.log('reson');
      // console.log(reason);
    });

  }

  editProduct(productId, product) {
    console.log(productId);
    this.productService.editCategoryProduct(productId, product).subscribe(res => {
      console.log(res);
      if (res) {
        this.product = {
          id: '',
          name: '',
          code: '',
          price: '',
          subCategoryId: ''
        };
        this.getCategoryProducts(this.page);
      }
    })
  }

  selectProduct(event, productId) {
    if (event.target.checked == true) {
      const index = this.selectedProductsIds.indexOf(productId);
      if (index > -1) return;
      this.selectedProductsIds.push(productId);
    } else {
      this.selectedProductsIds = this.selectedProductsIds.filter(id => id !== productId);
    }
    console.log(this.selectedProductsIds)
  }

  deleteItems() {
    this.selectedProductsIds.map(id => {
      this.productService.deleteCategoryProduct(id).subscribe(res => {
        this.getCategoryProducts(this.page);
        this.selectedProductsIds = [];
      })
    })
  }

  paginate(page) {
    this.getCategoryProducts(page);
  }

  ngOnDestroy() {

  }

}
