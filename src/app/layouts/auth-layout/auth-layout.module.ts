import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule
  ]
})
export class AuthLayoutModule { }
