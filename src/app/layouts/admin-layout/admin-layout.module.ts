import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminLayoutModule { }
