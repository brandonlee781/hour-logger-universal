import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from '@core/graphql.module';
import { MaterialModule } from '@core/material.module';
import { UIModule } from '@features/ui/ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GraphQLModule,
    MaterialModule,
    ReactiveFormsModule,
    UIModule,
  ],
  declarations: [],
})
export class UserModule {}
