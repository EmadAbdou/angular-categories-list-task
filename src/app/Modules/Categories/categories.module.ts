import { CoreModule } from './../../Core/core.module';
import { CategoryPageComponent } from './Pages/category-page/category-page.component';
import { CategoriesPageComponent } from './Pages/categories-page/categories-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: CategoriesPageComponent
  },
  {
    path: 'category/:id',
    component: CategoryPageComponent
  }
];


@NgModule({
  declarations: [
    CategoriesPageComponent,
    CategoryPageComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    CoreModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [CategoriesPageComponent]
})
export class CategoriesModule { }
