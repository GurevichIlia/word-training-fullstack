import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NbCardModule, NbCheckboxModule, NbInputModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';
import { LoaderComponent } from './loader/loader.component';




@NgModule({
  declarations: [



  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    NbCardModule,
    NbSpinnerModule,
    NbProgressBarModule,
    NbCheckboxModule,
    NbInputModule,


  ],
  exports: [



  ],
})
export class ComponentsModule { }
