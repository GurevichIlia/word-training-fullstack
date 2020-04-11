import { NgModule } from '@angular/core';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbButtonModule } from '@nebular/theme';

const modules = [
      NbLayoutModule,
      NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
      NbButtonModule
]
@NgModule({
      imports: [
            modules
      ],
      exports: [modules]
})
export class NebularModule { }