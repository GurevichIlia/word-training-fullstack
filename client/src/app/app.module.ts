import { ServerErrorInterceptor } from './shared/services/server-error-interceptor.service';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';


import { TokenInterceptorService } from './shared/services/token-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';


import * as Hammer from 'hammerjs';
import { NbListModule, NbThemeModule, NbToastrModule, NbMenuModule, NbSidebarModule, NbDialogModule } from '@nebular/theme';


@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { direction: Hammer.DIRECTION_ALL }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // UserDataComponent,
    // HomeComponent,
    // WordListComponent,



    // SelectionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbDialogModule.forRoot(),



  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },

    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }